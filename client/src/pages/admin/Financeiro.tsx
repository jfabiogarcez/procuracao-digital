import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Plus, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const honorariosMock = [
  {
    id: '1',
    cliente: 'João Silva Santos',
    descricao: 'Ação de Cobrança - Processo 1234567-89.2025',
    valorTotal: 50000.00,
    valorPago: 30000.00,
    valorPendente: 20000.00,
    status: 'parcial',
    formaPagamento: 'parcelado',
    dataVencimento: '2025-11-15',
  },
  {
    id: '2',
    cliente: 'Maria Oliveira Costa',
    descricao: 'Reclamação Trabalhista - Honorários Contratuais',
    valorTotal: 120000.00,
    valorPago: 120000.00,
    valorPendente: 0,
    status: 'pago',
    formaPagamento: 'avista',
    dataVencimento: '2025-09-20',
  },
  {
    id: '3',
    cliente: 'Pedro Henrique Alves',
    descricao: 'Divórcio Consensual - Honorários',
    valorTotal: 15000.00,
    valorPago: 0,
    valorPendente: 15000.00,
    status: 'pendente',
    formaPagamento: 'parcelado',
    dataVencimento: '2025-10-22',
  },
];

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pendente: { label: 'Pendente', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  parcial: { label: 'Parcial', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp },
  pago: { label: 'Pago', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700', icon: AlertTriangle },
};

export default function Financeiro() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [honorarios] = useState(honorariosMock);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const honorariosFiltrados = honorarios.filter(hon => {
    const matchBusca = hon.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      hon.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || hon.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const totalRecebido = honorarios.reduce((acc, h) => acc + h.valorPago, 0);
  const totalPendente = honorarios.reduce((acc, h) => acc + h.valorPendente, 0);
  const totalGeral = honorarios.reduce((acc, h) => acc + h.valorTotal, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-green-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestão Financeira</h1>
              <p className="text-sm text-green-200">Painel Administrativo</p>
            </div>
          </div>
          <Button onClick={() => alert('Novo honorário')} className="bg-white text-green-700 hover:bg-green-50">
            <Plus className="w-4 h-4 mr-2" />
            Novo Honorário
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Total Recebido</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalRecebido)}</div>
                </div>
                <DollarSign className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Total Pendente</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalPendente)}</div>
                </div>
                <AlertTriangle className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Total Geral</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalGeral)}</div>
                </div>
                <TrendingUp className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Taxa de Recebimento</div>
                  <div className="text-2xl font-bold">
                    {totalGeral > 0 ? Math.round((totalRecebido / totalGeral) * 100) : 0}%
                  </div>
                </div>
                <CheckCircle className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Honorários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-10"
                    placeholder="Cliente ou descrição..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="parcial">Parcial</option>
                  <option value="pago">Pago</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{honorariosFiltrados.length} honorário(s) encontrado(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {honorariosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum honorário encontrado</div>
              ) : (
                honorariosFiltrados.map((hon) => {
                  const StatusIcon = statusLabels[hon.status].icon;
                  return (
                    <div key={hon.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            <DollarSign className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{hon.cliente}</h3>
                              <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${statusLabels[hon.status].color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusLabels[hon.status].label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="font-medium text-gray-800">{hon.descricao}</div>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div>
                                  <div className="text-xs text-gray-500">Valor Total</div>
                                  <div className="font-semibold text-blue-600">{formatCurrency(hon.valorTotal)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Valor Pago</div>
                                  <div className="font-semibold text-green-600">{formatCurrency(hon.valorPago)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Valor Pendente</div>
                                  <div className="font-semibold text-red-600">{formatCurrency(hon.valorPendente)}</div>
                                </div>
                              </div>
                              <div className="flex gap-4 mt-2">
                                <span className="text-xs">Forma: {hon.formaPagamento}</span>
                                <span className="text-xs">Vencimento: {new Date(hon.dataVencimento).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => alert(`Registrar pagamento ${hon.id}`)}>
                            <DollarSign className="w-4 h-4 mr-1" />
                            Pagar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => alert(`Ver detalhes ${hon.id}`)}>
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

