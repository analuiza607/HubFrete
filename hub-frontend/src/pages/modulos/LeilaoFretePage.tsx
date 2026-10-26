import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Truck, Plus, Search, Filter, MapPin,
  Clock, CheckCircle2, X, ShieldCheck, DollarSign,
  TrendingDown, Check, FileText, ArrowRight, Layers,
  Calendar, Building2, Package, AlertCircle, ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Bid {
  id: string
  carrier: string
  cnpj: string
  rntrc: string
  rating: number
  amount: number
  deliveryDays: number
  submittedAt: string
}

interface Auction {
  id: string
  orderRefId?: string
  title: string
  category: string
  originCity: string
  originUF: string
  destCity: string
  destUF: string
  weightKg: number
  vehicleType: string
  ceilingPrice: number
  currentBestBid: number
  deadline: string
  urgent: boolean
  status: 'EM_DISPUTA' | 'AGUARDANDO_ADJUDICACAO' | 'CONTRATADO'
  winnerCarrier?: string
  bids: Bid[]
}

interface FreightOrder {
  id: string
  invoiceNumber: string
  customerName: string
  customerCnpj: string
  originCity: string
  originUF: string
  destCity: string
  destUF: string
  productDescription: string
  cargoType: 'FTL (Lotação)' | 'LTL (Fracionada)' | 'Química' | 'Siderúrgica'
  vehicleType: string
  weightKg: number
  palletsCount: number
  collectionDate: string
  deliveryDeadline: string
  cargoValue: number
  ceilingPrice: number
  status: 'RASCUNHO' | 'PRONTO_PARA_COTAR' | 'CONVERTIDO_EM_LEILAO'
  auctionId?: string
  createdAt: string
}

const INITIAL_ORDERS: FreightOrder[] = [
  {
    id: 'PED-8041',
    invoiceNumber: 'NF-e 104.920',
    customerName: 'Atacadão Distribuidora Sul S/A',
    customerCnpj: '45.123.890/0002-11',
    originCity: 'Campinas',
    originUF: 'SP',
    destCity: 'Porto Alegre',
    destUF: 'RS',
    productDescription: 'Bebidas Envasadas e Alimentos Paletizados',
    cargoType: 'FTL (Lotação)',
    vehicleType: 'Carreta Sider',
    weightKg: 14500,
    palletsCount: 26,
    collectionDate: '28/10/2026',
    deliveryDeadline: '31/10/2026',
    cargoValue: 142000,
    ceilingPrice: 5800,
    status: 'CONVERTIDO_EM_LEILAO',
    auctionId: 'AUCT-1042',
    createdAt: 'Hoje às 08:30'
  },
  {
    id: 'PED-8042',
    invoiceNumber: 'NF-e 104.935',
    customerName: 'Montadora ABC Automotiva Ltda',
    customerCnpj: '12.890.342/0001-50',
    originCity: 'Betim',
    originUF: 'MG',
    destCity: 'Resende',
    destUF: 'RJ',
    productDescription: 'Componentes Metálicos & Insumos de Montagem',
    cargoType: 'FTL (Lotação)',
    vehicleType: 'Truck Baú',
    weightKg: 6200,
    palletsCount: 12,
    collectionDate: '29/10/2026',
    deliveryDeadline: '30/10/2026',
    cargoValue: 88500,
    ceilingPrice: 3400,
    status: 'CONVERTIDO_EM_LEILAO',
    auctionId: 'AUCT-1043',
    createdAt: 'Hoje às 09:15'
  },
  {
    id: 'PED-8043',
    invoiceNumber: 'NF-e 104.980',
    customerName: 'Metalúrgica Catarinense S/A',
    customerCnpj: '78.234.901/0001-88',
    originCity: 'Curitiba',
    originUF: 'PR',
    destCity: 'Joinville',
    destUF: 'SC',
    productDescription: 'Bobinas de Aço Laminado a Quente',
    cargoType: 'Siderúrgica',
    vehicleType: 'Carreta Graneleira',
    weightKg: 24000,
    palletsCount: 8,
    collectionDate: '27/10/2026',
    deliveryDeadline: '28/10/2026',
    cargoValue: 215000,
    ceilingPrice: 2900,
    status: 'CONVERTIDO_EM_LEILAO',
    auctionId: 'AUCT-1044',
    createdAt: 'Ontem às 14:00'
  },
  {
    id: 'PED-8044',
    invoiceNumber: 'NF-e 105.012',
    customerName: 'Distribuidora Triângulo Alimentos',
    customerCnpj: '33.901.442/0001-20',
    originCity: 'Paulínia',
    originUF: 'SP',
    destCity: 'Uberlândia',
    destUF: 'MG',
    productDescription: 'Insumos Químicos Não-Perigosos em Tambores',
    cargoType: 'FTL (Lotação)',
    vehicleType: 'Carreta Baú',
    weightKg: 18000,
    palletsCount: 24,
    collectionDate: '30/10/2026',
    deliveryDeadline: '02/11/2026',
    cargoValue: 165000,
    ceilingPrice: 4900,
    status: 'PRONTO_PARA_COTAR',
    createdAt: 'Hoje às 10:10'
  },
  {
    id: 'PED-8045',
    invoiceNumber: 'NF-e 105.020',
    customerName: 'Armazéns Gerais do Centro-Oeste',
    customerCnpj: '19.482.900/0001-72',
    originCity: 'Ribeirão Preto',
    originUF: 'SP',
    destCity: 'Goiânia',
    destUF: 'GO',
    productDescription: 'Fardos de Embalagens e Descartáveis',
    cargoType: 'LTL (Fracionada)',
    vehicleType: 'Truck Baú',
    weightKg: 7500,
    palletsCount: 14,
    collectionDate: '01/11/2026',
    deliveryDeadline: '04/11/2026',
    cargoValue: 54000,
    ceilingPrice: 3800,
    status: 'PRONTO_PARA_COTAR',
    createdAt: 'Hoje às 10:25'
  },
  {
    id: 'PED-8046',
    invoiceNumber: 'NF-e Pendente (Pré-ordem)',
    customerName: 'Indústria Química Paulistana',
    customerCnpj: '61.229.400/0003-91',
    originCity: 'Paulínia',
    originUF: 'SP',
    destCity: 'Santos',
    destUF: 'SP',
    productDescription: 'Polímeros Plásticos para Exportação',
    cargoType: 'FTL (Lotação)',
    vehicleType: 'Carreta Sider',
    weightKg: 22000,
    palletsCount: 22,
    collectionDate: '03/11/2026',
    deliveryDeadline: '04/11/2026',
    cargoValue: 198000,
    ceilingPrice: 2400,
    status: 'RASCUNHO',
    createdAt: 'Hoje às 10:30'
  },
]

const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'AUCT-1042',
    orderRefId: 'PED-8041',
    title: 'Carga Paletizada de Alimentos',
    category: 'FTL (Lotação)',
    originCity: 'Campinas',
    originUF: 'SP',
    destCity: 'Porto Alegre',
    destUF: 'RS',
    weightKg: 14500,
    vehicleType: 'Carreta Sider',
    ceilingPrice: 5800,
    currentBestBid: 4350,
    deadline: '01h 45m',
    urgent: true,
    status: 'EM_DISPUTA',
    bids: [
      { id: 'b1', carrier: 'Transcontinental Cargas Ltda', cnpj: '18.234.567/0001-89', rntrc: '45.109.821', rating: 4.9, amount: 4350, deliveryDays: 2, submittedAt: '10:42' },
      { id: 'b2', carrier: 'Rodoviário São Paulo-Sul S/A', cnpj: '03.882.109/0002-14', rntrc: '12.839.102', rating: 4.8, amount: 4500, deliveryDays: 2, submittedAt: '10:20' },
      { id: 'b3', carrier: 'Expresso Mercúrio Logística', cnpj: '60.119.400/0001-55', rntrc: '98.201.442', rating: 4.6, amount: 4750, deliveryDays: 3, submittedAt: '09:55' },
    ]
  },
  {
    id: 'AUCT-1043',
    orderRefId: 'PED-8042',
    title: 'Peças Automotivas & Insumos',
    category: 'FTL (Lotação)',
    originCity: 'Betim',
    originUF: 'MG',
    destCity: 'Resende',
    destUF: 'RJ',
    weightKg: 6200,
    vehicleType: 'Truck Baú',
    ceilingPrice: 3400,
    currentBestBid: 2650,
    deadline: '04h 10m',
    urgent: false,
    status: 'EM_DISPUTA',
    bids: [
      { id: 'b4', carrier: 'Valle Transportes Especiais', cnpj: '44.901.321/0001-12', rntrc: '33.109.482', rating: 4.9, amount: 2650, deliveryDays: 1, submittedAt: '10:50' },
      { id: 'b5', carrier: 'Minas-Rio Cargas Rápidas', cnpj: '21.002.394/0001-90', rntrc: '22.901.114', rating: 4.7, amount: 2800, deliveryDays: 1, submittedAt: '09:30' },
    ]
  },
  {
    id: 'AUCT-1044',
    orderRefId: 'PED-8043',
    title: 'Bobinas de Aço Laminado',
    category: 'Siderúrgica / Pesada',
    originCity: 'Curitiba',
    originUF: 'PR',
    destCity: 'Joinville',
    destUF: 'SC',
    weightKg: 24000,
    vehicleType: 'Carreta Graneleira',
    ceilingPrice: 2900,
    currentBestBid: 1980,
    deadline: 'Encerrado',
    urgent: true,
    status: 'AGUARDANDO_ADJUDICACAO',
    bids: [
      { id: 'b6', carrier: 'Sul Aço Logística Integrada', cnpj: '08.992.310/0001-09', rntrc: '77.810.231', rating: 5.0, amount: 1980, deliveryDays: 1, submittedAt: '10:00' },
      { id: 'b7', carrier: 'Catarina Fretes Pesados Ltda', cnpj: '71.229.400/0001-77', rntrc: '55.492.001', rating: 4.8, amount: 2100, deliveryDays: 1, submittedAt: '08:45' },
    ]
  },
]

export default function LeilaoFretePage() {
  // Controle de Visualização Principal: 'PEDIDOS' ou 'LEILOES'
  const [activeTab, setActiveTab] = useState<'PEDIDOS' | 'LEILOES'>('PEDIDOS')

  const [orders, setOrders] = useState<FreightOrder[]>(INITIAL_ORDERS)
  const [auctions, setAuctions] = useState<Auction[]>(INITIAL_AUCTIONS)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [auctionSearchTerm, setAuctionSearchTerm] = useState('')
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  // Form State para Novo Pedido de Frete
  const [newInvoice, setNewInvoice] = useState('')
  const [newCustomer, setNewCustomer] = useState('')
  const [newCnpj, setNewCnpj] = useState('')
  const [newOriginCity, setNewOriginCity] = useState('Paulínia')
  const [newOriginUF, setNewOriginUF] = useState('SP')
  const [newDestCity, setNewDestCity] = useState('')
  const [newDestUF, setNewDestUF] = useState('MG')
  const [newProduct, setNewProduct] = useState('')
  const [newCargoType, setNewCargoType] = useState<'FTL (Lotação)' | 'LTL (Fracionada)' | 'Química' | 'Siderúrgica'>('FTL (Lotação)')
  const [newVehicle, setNewVehicle] = useState('Carreta Sider')
  const [newWeight, setNewWeight] = useState('')
  const [newPallets, setNewPallets] = useState('')
  const [newCeiling, setNewCeiling] = useState('')
  const [newCollectionDate, setNewCollectionDate] = useState('30/10/2026')
  const [newDeadlineDate, setNewDeadlineDate] = useState('02/11/2026')
  const [autoConvert, setAutoConvert] = useState(false)

  // Criar Pedido de Frete
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const ceiling = parseFloat(newCeiling.replace(/[^0-9]/g, '')) || 4500
    const weight = parseInt(newWeight.replace(/[^0-9]/g, '')) || 12000
    const pallets = parseInt(newPallets.replace(/[^0-9]/g, '')) || 16

    const newOrderId = `PED-${Math.floor(8050 + Math.random() * 50)}`

    const newOrder: FreightOrder = {
      id: newOrderId,
      invoiceNumber: newInvoice.trim() || 'NF-e Emissão Própria',
      customerName: newCustomer.trim(),
      customerCnpj: newCnpj.trim() || '00.000.000/0001-00',
      originCity: newOriginCity.trim(),
      originUF: newOriginUF.toUpperCase(),
      destCity: newDestCity.trim(),
      destUF: newDestUF.toUpperCase(),
      productDescription: newProduct.trim(),
      cargoType: newCargoType,
      vehicleType: newVehicle,
      weightKg: weight,
      palletsCount: pallets,
      collectionDate: newCollectionDate,
      deliveryDeadline: newDeadlineDate,
      cargoValue: 120000,
      ceilingPrice: ceiling,
      status: autoConvert ? 'CONVERTIDO_EM_LEILAO' : 'PRONTO_PARA_COTAR',
      createdAt: 'Agora mesmo'
    }

    if (autoConvert) {
      const newAuctionId = `AUCT-${Math.floor(1050 + Math.random() * 50)}`
      newOrder.auctionId = newAuctionId

      const newAuction: Auction = {
        id: newAuctionId,
        orderRefId: newOrderId,
        title: newProduct.trim(),
        category: newCargoType,
        originCity: newOriginCity.trim(),
        originUF: newOriginUF.toUpperCase(),
        destCity: newDestCity.trim(),
        destUF: newDestUF.toUpperCase(),
        weightKg: weight,
        vehicleType: newVehicle,
        ceilingPrice: ceiling,
        currentBestBid: Math.round(ceiling * 0.88),
        deadline: '06h 00m',
        urgent: false,
        status: 'EM_DISPUTA',
        bids: [
          {
            id: `b-${Date.now()}`,
            carrier: 'Transcontinental Cargas Ltda',
            cnpj: '18.234.567/0001-89',
            rntrc: '45.109.821',
            rating: 4.9,
            amount: Math.round(ceiling * 0.88),
            deliveryDays: 2,
            submittedAt: 'agora mesmo'
          }
        ]
      }
      setAuctions([newAuction, ...auctions])
      setSuccessBanner(`Pedido ${newOrderId} criado e publicado no leilão como ${newAuctionId}!`)
    } else {
      setSuccessBanner(`Pedido de frete ${newOrderId} criado e salvo como Pronto para Cotar!`)
    }

    setOrders([newOrder, ...orders])
    setIsOrderModalOpen(false)

    // Limpeza de formulário
    setNewCustomer('')
    setNewInvoice('')
    setNewProduct('')
    setNewWeight('')
    setNewCeiling('')
    setNewDestCity('')
  }

  // Converter Pedido de Frete em Leilão para Transportadores
  const handleConvertOrderToAuction = (order: FreightOrder) => {
    const newAuctionId = `AUCT-${Math.floor(1060 + Math.random() * 50)}`

    const newAuction: Auction = {
      id: newAuctionId,
      orderRefId: order.id,
      title: order.productDescription,
      category: order.cargoType,
      originCity: order.originCity,
      originUF: order.originUF,
      destCity: order.destCity,
      destUF: order.destUF,
      weightKg: order.weightKg,
      vehicleType: order.vehicleType,
      ceilingPrice: order.ceilingPrice,
      currentBestBid: Math.round(order.ceilingPrice * 0.86),
      deadline: '06h 00m',
      urgent: false,
      status: 'EM_DISPUTA',
      bids: [
        {
          id: `b-${Date.now()}`,
          carrier: 'Rodoviário São Paulo-Sul S/A',
          cnpj: '03.882.109/0002-14',
          rntrc: '12.839.102',
          rating: 4.8,
          amount: Math.round(order.ceilingPrice * 0.86),
          deliveryDays: 2,
          submittedAt: 'agora mesmo'
        }
      ]
    }

    // Atualiza status do pedido
    setOrders(prev =>
      prev.map(o => o.id === order.id ? { ...o, status: 'CONVERTIDO_EM_LEILAO', auctionId: newAuctionId } : o)
    )

    // Adiciona aos leilões
    setAuctions([newAuction, ...auctions])

    setSuccessBanner(`Pedido ${order.id} convertido com sucesso! Oferta gerada: ${newAuctionId}.`)
  }

  // Adjudicar lance de transportadora
  const handleAdjudicate = (auctionId: string, bid: Bid) => {
    setAuctions(prev =>
      prev.map(a =>
        a.id === auctionId
          ? { ...a, status: 'CONTRATADO', winnerCarrier: bid.carrier }
          : a
      )
    )
    if (selectedAuction?.id === auctionId) {
      setSelectedAuction(prev => prev ? { ...prev, status: 'CONTRATADO', winnerCarrier: bid.carrier } : null)
    }
    setSuccessBanner(`Frete ${auctionId} adjudicado com sucesso para ${bid.carrier}! Contrato gerado.`)
  }

  // Filtros
  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.invoiceNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.destCity.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.productDescription.toLowerCase().includes(orderSearchTerm.toLowerCase())
  )

  const filteredAuctions = auctions.filter(a =>
    a.id.toLowerCase().includes(auctionSearchTerm.toLowerCase()) ||
    a.title.toLowerCase().includes(auctionSearchTerm.toLowerCase()) ||
    a.destCity.toLowerCase().includes(auctionSearchTerm.toLowerCase()) ||
    (a.orderRefId && a.orderRefId.toLowerCase().includes(auctionSearchTerm.toLowerCase()))
  )

  const readyOrdersCount = orders.filter(o => o.status === 'PRONTO_PARA_COTAR').length
  const activeAuctionsCount = auctions.filter(a => a.status === 'EM_DISPUTA').length

  return (
    <AppShell breadcrumb="Gestão de Cargas & Cotações">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Banner de Feedback Operacional */}
        {successBanner && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-md text-xs flex items-center justify-between animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successBanner}</span>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Cabeçalho Principal do Módulo */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                MÓDULO 01 • LOGÍSTICA DE CARGAS
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {readyOrdersCount} Pedidos Aguardando Cotação
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Gestão de Pedidos & Leilões de Frete
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Crie pedidos de expedição da sua empresa, converta-os em ofertas de leilão reverso e contrate transportadoras com deságio garantido.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => setIsOrderModalOpen(true)}
              className="text-xs font-semibold px-4 py-2 shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Pedido de Frete
            </Button>
          </div>
        </div>

        {/* NAVEGADOR DE ABAS PRINCIPAIS: PEDIDOS DE FRETE vs LEILÕES EM ANDAMENTO */}
        <div className="border-b border-slate-200 flex items-center justify-between bg-white px-4 rounded-t-lg border-t border-l border-r">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('PEDIDOS')}
              className={cn(
                'py-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors',
                activeTab === 'PEDIDOS'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Pedidos de Frete (Entrada de Cargas)</span>
              <span className={cn(
                'text-[10px] font-mono px-1.5 py-0.2 rounded font-bold',
                activeTab === 'PEDIDOS'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600'
              )}>
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('LEILOES')}
              className={cn(
                'py-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors',
                activeTab === 'LEILOES'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              <Truck className="h-4 w-4" />
              <span>Mural de Leilões em Disputa</span>
              <span className={cn(
                'text-[10px] font-mono px-1.5 py-0.2 rounded font-bold',
                activeTab === 'LEILOES'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600'
              )}>
                {auctions.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            {activeTab === 'PEDIDOS'
              ? 'Converte demandas internas em disputas de frete'
              : 'Acompanhamento de lances das transportadoras'}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            ABA 1: JANELA DE PEDIDOS DE FRETE (CRIAR E CONVERTER)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'PEDIDOS' && (
          <div className="space-y-4 animate-fade-in">
            {/* Indicadores do Pipeline de Pedidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Total de Pedidos
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1">{orders.length}</p>
                <span className="text-[10px] text-slate-400">Demandas registradas</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-blue-700 block uppercase tracking-wider">
                  Prontos p/ Cotar
                </span>
                <p className="text-xl font-bold text-blue-600 mt-1">{readyOrdersCount}</p>
                <span className="text-[10px] text-blue-500">Aguardando envio ao leilão</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
                  Convertidos em Leilão
                </span>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {orders.filter(o => o.status === 'CONVERTIDO_EM_LEILAO').length}
                </p>
                <span className="text-[10px] text-emerald-500">Recebendo lances</span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Em Elaboração
                </span>
                <p className="text-xl font-bold text-slate-700 mt-1">
                  {orders.filter(o => o.status === 'RASCUNHO').length}
                </p>
                <span className="text-[10px] text-slate-400">Rascunhos pendentes</span>
              </div>
            </div>

            {/* Barra de Filtro de Pedidos */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Filtrar Pedidos:</span>
                <span className="text-slate-400 text-[11px]">
                  Mostrando {filteredOrders.length} registros
                </span>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por NF-e, cliente, cidade, pedido..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full h-8.5 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            {/* Tabela de Pedidos de Frete de Alta Densidade */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="enterprise-th">Pedido / NF-e</th>
                      <th className="enterprise-th">Cliente / Destinatário</th>
                      <th className="enterprise-th">Origem → Destino</th>
                      <th className="enterprise-th">Produto & Carga</th>
                      <th className="enterprise-th">Veículo Requerido</th>
                      <th className="enterprise-th text-right">Peso (kg)</th>
                      <th className="enterprise-th text-right">Teto Orçado</th>
                      <th className="enterprise-th text-center">Data Coleta</th>
                      <th className="enterprise-th text-center">Status</th>
                      <th className="enterprise-th text-right">Ação Operacional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-xs text-slate-500">
                          Nenhum pedido de frete encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                          {/* ID e NF */}
                          <td className="enterprise-td whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-900 block">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {order.invoiceNumber}
                            </span>
                          </td>

                          {/* Cliente */}
                          <td className="enterprise-td whitespace-nowrap">
                            <span className="font-semibold text-slate-800 text-xs block">
                              {order.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              CNPJ: {order.customerCnpj}
                            </span>
                          </td>

                          {/* Rota */}
                          <td className="enterprise-td whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-800">
                              <span>{order.originCity}</span>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1 rounded border border-slate-200 font-mono">
                                {order.originUF}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span>{order.destCity}</span>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1 rounded border border-slate-200 font-mono">
                                {order.destUF}
                              </span>
                            </div>
                          </td>

                          {/* Produto */}
                          <td className="enterprise-td whitespace-nowrap">
                            <span className="font-medium text-slate-900 text-xs block">
                              {order.productDescription}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {order.cargoType} • {order.palletsCount} Paletes
                            </span>
                          </td>

                          {/* Veículo */}
                          <td className="enterprise-td text-xs text-slate-600 whitespace-nowrap">
                            {order.vehicleType}
                          </td>

                          {/* Peso */}
                          <td className="enterprise-td text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                            {order.weightKg.toLocaleString('pt-BR')} kg
                          </td>

                          {/* Preço Teto */}
                          <td className="enterprise-td text-right font-mono text-xs font-semibold text-slate-800 whitespace-nowrap">
                            R$ {order.ceilingPrice.toLocaleString('pt-BR')}
                          </td>

                          {/* Coleta */}
                          <td className="enterprise-td text-center text-xs text-slate-600 font-mono whitespace-nowrap">
                            {order.collectionDate}
                          </td>

                          {/* Status */}
                          <td className="enterprise-td text-center whitespace-nowrap">
                            {order.status === 'CONVERTIDO_EM_LEILAO' ? (
                              <Badge variant="success">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Em Leilão ({order.auctionId})
                              </Badge>
                            ) : order.status === 'PRONTO_PARA_COTAR' ? (
                              <Badge variant="info">
                                Pronto p/ Cotar
                              </Badge>
                            ) : (
                              <Badge variant="muted">
                                Rascunho
                              </Badge>
                            )}
                          </td>

                          {/* Ação */}
                          <td className="enterprise-td text-right whitespace-nowrap">
                            {order.status === 'PRONTO_PARA_COTAR' ? (
                              <Button
                                size="sm"
                                onClick={() => handleConvertOrderToAuction(order)}
                                className="text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                              >
                                Lançar no Leilão
                                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                              </Button>
                            ) : order.status === 'CONVERTIDO_EM_LEILAO' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setActiveTab('LEILOES')
                                  if (order.auctionId) setAuctionSearchTerm(order.auctionId)
                                }}
                                className="text-[11px]"
                              >
                                Ver Leilão Ativo
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="text-[11px]" disabled>
                                Editar Rascunho
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Rodapé da Tabela de Pedidos */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Total de <strong>{filteredOrders.length}</strong> pedidos registrados no sistema
                </span>
                <span className="text-[11px]">
                  Os pedidos com status <strong>Pronto p/ Cotar</strong> podem ser lançados diretamente para cotação das transportadoras.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            ABA 2: MURAL DE LEILÕES & COTAÇÕES (DISPUTA EM TEMPO REAL)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'LEILOES' && (
          <div className="space-y-4 animate-fade-in">
            {/* Barra de Filtro de Leilões */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Leilões em Andamento:</span>
                <span className="text-[11px] text-slate-400">
                  {filteredAuctions.length} ofertas ativas
                </span>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar código de leilão, pedido, rota..."
                  value={auctionSearchTerm}
                  onChange={(e) => setAuctionSearchTerm(e.target.value)}
                  className="w-full h-8.5 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            {/* Tabela de Leilões de Frete (Data Grid) */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="enterprise-th">Cotação / Origem</th>
                      <th className="enterprise-th">Produto & Carga</th>
                      <th className="enterprise-th">Rota (Origem → Destino)</th>
                      <th className="enterprise-th">Veículo Requerido</th>
                      <th className="enterprise-th text-right">Peso (kg)</th>
                      <th className="enterprise-th text-right">Preço Teto</th>
                      <th className="enterprise-th text-right">Melhor Lance</th>
                      <th className="enterprise-th text-right">Deságio (%)</th>
                      <th className="enterprise-th text-center">Lances</th>
                      <th className="enterprise-th text-center">Status</th>
                      <th className="enterprise-th text-right">Decisão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuctions.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-xs text-slate-500">
                          Nenhum leilão de frete encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredAuctions.map((row) => {
                        const savings = Math.max(0, row.ceilingPrice - row.currentBestBid)
                        const savingsPercent = Math.round((savings / row.ceilingPrice) * 100)

                        return (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                            {/* Código */}
                            <td className="enterprise-td whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-slate-900 block">
                                {row.id}
                              </span>
                              {row.orderRefId && (
                                <span className="text-[10px] text-blue-600 font-mono block">
                                  Ref: {row.orderRefId}
                                </span>
                              )}
                            </td>

                            {/* Carga */}
                            <td className="enterprise-td whitespace-nowrap">
                              <span className="font-semibold text-slate-900 text-xs block">
                                {row.title}
                              </span>
                              <span className="text-[10px] text-slate-500">{row.category}</span>
                            </td>

                            {/* Rota */}
                            <td className="enterprise-td whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs text-slate-800">
                                <span>{row.originCity}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1 rounded border border-slate-200 font-mono">
                                  {row.originUF}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span>{row.destCity}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1 rounded border border-slate-200 font-mono">
                                  {row.destUF}
                                </span>
                              </div>
                            </td>

                            {/* Veículo */}
                            <td className="enterprise-td text-xs text-slate-600 whitespace-nowrap">
                              {row.vehicleType}
                            </td>

                            {/* Peso */}
                            <td className="enterprise-td text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                              {row.weightKg.toLocaleString('pt-BR')} kg
                            </td>

                            {/* Preço Teto */}
                            <td className="enterprise-td text-right font-mono text-xs text-slate-500 whitespace-nowrap">
                              R$ {row.ceilingPrice.toLocaleString('pt-BR')}
                            </td>

                            {/* Melhor Lance */}
                            <td className="enterprise-td text-right font-mono text-xs font-bold text-emerald-700 whitespace-nowrap">
                              R$ {row.currentBestBid.toLocaleString('pt-BR')}
                            </td>

                            {/* Economia */}
                            <td className="enterprise-td text-right font-mono text-xs text-emerald-700 whitespace-nowrap">
                              -{savingsPercent}% <span className="text-[10px] text-slate-400 font-normal">(-R$ {savings})</span>
                            </td>

                            {/* Lances */}
                            <td className="enterprise-td text-center whitespace-nowrap">
                              <span className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-mono font-semibold px-2 py-0.5 rounded text-xs border border-slate-200">
                                {row.bids.length}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="enterprise-td text-center whitespace-nowrap">
                              {row.status === 'CONTRATADO' ? (
                                <Badge variant="success">Contratado</Badge>
                              ) : row.status === 'AGUARDANDO_ADJUDICACAO' ? (
                                <Badge variant="warning">Aguardando Escolha</Badge>
                              ) : (
                                <Badge variant="info">Em Leilão ({row.deadline})</Badge>
                              )}
                            </td>

                            {/* Ação */}
                            <td className="enterprise-td text-right whitespace-nowrap">
                              <Button
                                size="sm"
                                variant={row.status === 'AGUARDANDO_ADJUDICACAO' ? 'default' : 'outline'}
                                onClick={() => setSelectedAuction(row)}
                                className="text-[11px] font-semibold"
                              >
                                Ver Propostas ({row.bids.length})
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Rodapé da Tabela de Leilões */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Mostrando <strong>{filteredAuctions.length}</strong> de <strong>{auctions.length}</strong> cotações no mural
                </span>
                <span className="text-[11px] text-slate-400">
                  Os valores sofrem redução automática conforme os transportadores enviam lances em tempo real.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL CORPORATIVO: NOVO PEDIDO DE FRETE (ENTRADA DE CARGA) ─ */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-lg border border-slate-300 w-full max-w-2xl shadow-xl animate-fade-in overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Criar Novo Pedido de Frete (Ordem de Expedição)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Registre os dados do pedido de venda e parametrize os requisitos de transporte
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                {/* Linha 1: Nota Fiscal & Cliente */}
                <div className="grid grid-cols-2 gap-3.5">
                  <Input
                    label="Nota Fiscal / Pedido de Venda"
                    placeholder="Ex: NF-e 105.420"
                    value={newInvoice}
                    onChange={(e) => setNewInvoice(e.target.value)}
                    required
                  />
                  <Input
                    label="Razão Social do Cliente / Destinatário"
                    placeholder="Ex: Atacadão Distribuidora Sul S/A"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    required
                  />
                </div>

                {/* Linha 2: Produto & CNPJ Destinatário */}
                <div className="grid grid-cols-2 gap-3.5">
                  <Input
                    label="Descrição da Mercadoria"
                    placeholder="Ex: Carga Paletizada de Bebidas"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    required
                  />
                  <Input
                    label="CNPJ do Destinatário"
                    placeholder="Ex: 45.123.890/0002-11"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                  />
                </div>

                {/* Linha 3: Origem e Destino com UF */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">Origem (Expedição)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cidade Origem"
                        value={newOriginCity}
                        onChange={(e) => setNewOriginCity(e.target.value)}
                        className="h-8.5 flex-1 rounded-md border border-slate-300 px-2.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        value={newOriginUF}
                        onChange={(e) => setNewOriginUF(e.target.value.toUpperCase())}
                        maxLength={2}
                        className="h-8.5 w-12 text-center uppercase rounded-md border border-slate-300 text-xs text-slate-900 focus:border-slate-800 focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">Destino (Entrega)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cidade Destino"
                        value={newDestCity}
                        onChange={(e) => setNewDestCity(e.target.value)}
                        className="h-8.5 flex-1 rounded-md border border-slate-300 px-2.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        value={newDestUF}
                        onChange={(e) => setNewDestUF(e.target.value.toUpperCase())}
                        maxLength={2}
                        className="h-8.5 w-12 text-center uppercase rounded-md border border-slate-300 text-xs text-slate-900 focus:border-slate-800 focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Linha 4: Peso, Paletes e Preço Teto */}
                <div className="grid grid-cols-3 gap-3.5">
                  <Input
                    label="Peso Total (kg)"
                    placeholder="Ex: 14500"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    required
                  />
                  <Input
                    label="Qtd Paletes / Volumes"
                    placeholder="Ex: 24"
                    value={newPallets}
                    onChange={(e) => setNewPallets(e.target.value)}
                    required
                  />
                  <Input
                    label="Preço Teto Orçado (R$)"
                    placeholder="Ex: 5800"
                    value={newCeiling}
                    onChange={(e) => setNewCeiling(e.target.value)}
                    required
                  />
                </div>

                {/* Linha 5: Veículo & Categoria */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">Tipo de Veículo / Carroceria</label>
                    <select
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      className="w-full h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    >
                      <option value="Carreta Sider">Carreta Sider</option>
                      <option value="Carreta Baú">Carreta Baú</option>
                      <option value="Carreta Graneleira">Carreta Graneleira</option>
                      <option value="Caminhão Truck Baú">Caminhão Truck Baú</option>
                      <option value="Frigorífico / Refrigerado">Frigorífico / Refrigerado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block">Tipo de Operação</label>
                    <select
                      value={newCargoType}
                      onChange={(e) => setNewCargoType(e.target.value as any)}
                      className="w-full h-8.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    >
                      <option value="FTL (Lotação)">FTL (Lotação Completa)</option>
                      <option value="LTL (Fracionada)">LTL (Fracionada)</option>
                      <option value="Química">Química / Controlada</option>
                      <option value="Siderúrgica">Siderúrgica / Pesada</option>
                    </select>
                  </div>
                </div>

                {/* Opção de Conversão Direta */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={autoConvert}
                      onChange={(e) => setAutoConvert(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Converter e lançar imediatamente no Leilão de Fretes</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOrderModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">
                      Salvar Pedido de Frete
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── QUADRO COMPARATIVO DE LANCES (TABELA DE ADJUDICAÇÃO) ──── */}
        {selectedAuction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-lg border border-slate-300 w-full max-w-3xl shadow-xl animate-fade-in overflow-hidden">
              {/* Header do Drawer */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{selectedAuction.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-900">{selectedAuction.title}</span>
                    {selectedAuction.orderRefId && (
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-mono">
                        Pedido: {selectedAuction.orderRefId}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedAuction.originCity}/{selectedAuction.originUF} → {selectedAuction.destCity}/{selectedAuction.destUF} • {selectedAuction.weightKg.toLocaleString('pt-BR')} kg ({selectedAuction.vehicleType})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAuction(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Faixa de Parâmetros Financeiros */}
              <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Preço Teto Orçado:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    R$ {selectedAuction.ceilingPrice.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Melhor Lance da Disputa:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    R$ {selectedAuction.currentBestBid.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Situação:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAuction.status === 'CONTRATADO'
                      ? `Contratada (${selectedAuction.winnerCarrier})`
                      : 'Em Análise de Propostas'}
                  </span>
                </div>
              </div>

              {/* Tabela Comparativa de Transportadoras */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Propostas Enviadas pelas Transportadoras Homologadas ({selectedAuction.bids.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">Ordenadas pelo menor valor</span>
                </div>

                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="enterprise-th">Transportadora</th>
                        <th className="enterprise-th">CNPJ / RNTRC</th>
                        <th className="enterprise-th text-center">Nota</th>
                        <th className="enterprise-th text-center">Prazo</th>
                        <th className="enterprise-th text-right">Valor da Oferta</th>
                        <th className="enterprise-th text-right">Deságio</th>
                        <th className="enterprise-th text-right">Decisão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAuction.bids.map((bid, idx) => {
                        const isWinner = selectedAuction.winnerCarrier === bid.carrier
                        const diff = selectedAuction.ceilingPrice - bid.amount
                        const pct = Math.round((diff / selectedAuction.ceilingPrice) * 100)

                        return (
                          <tr
                            key={bid.id}
                            className={cn(
                              'border-b border-slate-100 hover:bg-slate-50/80',
                              idx === 0 && selectedAuction.status !== 'CONTRATADO' && 'bg-emerald-50/40',
                              isWinner && 'bg-emerald-50/70 font-medium'
                            )}
                          >
                            <td className="enterprise-td">
                              <span className="font-bold text-slate-900 block">{bid.carrier}</span>
                              <span className="text-[10px] text-slate-500">Lance enviado às {bid.submittedAt}</span>
                            </td>
                            <td className="enterprise-td text-slate-600 font-mono text-[11px]">
                              <div>{bid.cnpj}</div>
                              <div className="text-slate-400">RNTRC {bid.rntrc}</div>
                            </td>
                            <td className="enterprise-td text-center text-slate-700">
                              ★ {bid.rating.toFixed(1)}
                            </td>
                            <td className="enterprise-td text-center text-slate-700">
                              {bid.deliveryDays} dia(s)
                            </td>
                            <td className="enterprise-td text-right font-mono font-bold text-slate-900">
                              R$ {bid.amount.toLocaleString('pt-BR')}
                            </td>
                            <td className="enterprise-td text-right font-mono text-emerald-700">
                              -{pct}% <span className="text-[10px] text-slate-400 font-normal">(-R$ {diff})</span>
                            </td>
                            <td className="enterprise-td text-right">
                              {selectedAuction.status !== 'CONTRATADO' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleAdjudicate(selectedAuction.id, bid)}
                                  className="text-[11px]"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Adjudicar
                                </Button>
                              ) : isWinner ? (
                                <Badge variant="success">Vencedor</Badge>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Não selecionada</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rodapé do Drawer */}
              <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Todas as transportadoras têm cadastro aprovado e apólice RCTR-C vigente
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAuction(null)}
                >
                  Fechar Quadro
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
