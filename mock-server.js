import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'users.json');
const PORT = 3000;

// Carrega ou inicializa banco de dados local
function loadUsers() {
  if (!fs.existsSync(DB_FILE)) {
    // Usuário padrão de demonstração
    const defaultUser = {
      id: crypto.randomUUID(),
      name: 'Ana Luiza (Admin)',
      email: 'analuiza@fretebid.com',
      passwordHash: hashPassword('senha123456'),
      role: 'EMBARCADOR',
      created_at: new Date().toISOString()
    };
    const initialData = [defaultUser];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd + '_frete_bid_salt').digest('hex');
}

function generateToken(user) {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 dias
  };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', 'super-secret-hub-key-change-in-production')
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', 'super-secret-hub-key-change-in-production')
      .update(`${header}.${body}`)
      .digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

const MODULES = [
  {
    id: 'mod-1',
    name: 'Leilão de Frete',
    slug: 'leilao-frete',
    description: 'Cotação em tempo real e leilão reverso de cargas com lances transparentes.',
    icon: 'Truck',
    is_active: true,
    route_path: '/modulos/leilao-frete',
    access_level: null
  },
  {
    id: 'mod-2',
    name: 'Gestão de Frotas',
    slug: 'gestao-frotas',
    description: 'Telemetria, manutenção preventiva e rastreamento de veículos.',
    icon: 'Package',
    is_active: false,
    route_path: '/modulos/frotas',
    access_level: 'ADMIN'
  },
  {
    id: 'mod-3',
    name: 'Faturamento & DACTE',
    slug: 'faturamento',
    description: 'Emissão automatizada de CT-e, MDF-e e conciliação financeira.',
    icon: 'FileText',
    is_active: false,
    route_path: '/modulos/faturamento',
    access_level: 'EMBARCADOR'
  },
  {
    id: 'mod-4',
    name: 'Analytics & BI',
    slug: 'analytics',
    description: 'Painéis executivos de SLA, custos por km rodado e performance operacional.',
    icon: 'BarChart3',
    is_active: false,
    route_path: '/modulos/analytics',
    access_level: 'ADMIN'
  }
];

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try { parsedBody = JSON.parse(body); } catch {}
    }

    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // ─── Health check ────────────────────────────────────────────────────────
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(200, { status: 'ok', version: '0.1.0' });
    }

    // ─── POST /api/auth/register ──────────────────────────────────────────────
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const { name, email, password, role } = parsedBody;
      if (!name || !email || !password || !role) {
        return sendJson(400, {
          success: false,
          error: 'BAD_REQUEST',
          message: 'Todos os campos (nome, email, senha, perfil) são obrigatórios.'
        });
      }

      const users = loadUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return sendJson(409, {
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'Este email já está cadastrado no sistema.'
        });
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: hashPassword(password),
        role: role.toUpperCase(),
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      return sendJson(201, {
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        data: sanitizeUser(newUser)
      });
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = parsedBody;
      if (!email || !password) {
        return sendJson(400, {
          success: false,
          error: 'BAD_REQUEST',
          message: 'Email e senha são obrigatórios.'
        });
      }

      const users = loadUsers();
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashPassword(password)
      );

      if (!user) {
        return sendJson(401, {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas. Verifique seu e-mail e senha.'
        });
      }

      const token = generateToken(user);
      return sendJson(200, {
        success: true,
        token,
        user: sanitizeUser(user)
      });
    }

    // ─── GET /api/auth/me ─────────────────────────────────────────────────────
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendJson(401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Token de autenticação não fornecido.'
        });
      }

      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (!payload) {
        return sendJson(401, {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Sessão expirada ou token inválido.'
        });
      }

      const users = loadUsers();
      const user = users.find(u => u.id === payload.sub);
      if (!user) {
        return sendJson(404, {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado.'
        });
      }

      return sendJson(200, {
        success: true,
        data: sanitizeUser(user)
      });
    }

    // ─── GET /api/hub/modules ─────────────────────────────────────────────────
    if (pathname === '/api/hub/modules' && req.method === 'GET') {
      return sendJson(200, {
        success: true,
        data: MODULES
      });
    }

    // ─── 404 ──────────────────────────────────────────────────────────────────
    return sendJson(404, {
      success: false,
      error: 'NOT_FOUND',
      message: `Rota ${pathname} não encontrada.`
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API Server escutando em http://127.0.0.1:${PORT}`);
  // Garante que o banco tem ao menos 1 usuário
  const users = loadUsers();
  console.log(`Banco inicializado com ${users.length} usuário(s).`);
});
