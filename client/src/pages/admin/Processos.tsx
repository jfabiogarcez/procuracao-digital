import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Plus, Scale, Eye, Edit, AlertCircle } from 'lucide-react';

const processosMock = [
  {
    id: '1',
    numeroProcesso: '1234567-89.2025.8.26.0100',
    cliente: 'João Silva Santos',
    tipo: 'Cível',
    area: 'Direito Civil',
    objeto: 'Ação de Cobrança',
    valor: 'R$ 50.000,00',
    status: 'em_andamento',
    comarca: 'São Paulo',
    vara: '1ª Vara Cível',
    dataDistribuicao: '2025-01-15',
    proximoPrazo: '2025-10-25',
  },
  {
    id: '2',
    numeroProcesso: '9876543-21.2025.5.02.0001',
    cliente: 'Maria Oliveira Costa',
    tipo: 'Trabalhista',
    area: 'Direito do Trabalho',
    objeto: 'Reclamação Trabalhista - Verbas Rescisórias',
    valor: 'R$ 120.000,00',
    status: 'em_andamento',
    comarca: 'São Paulo',
    vara: '3ª Vara do Trabalho',
    dataDistribuicao: '2025-02-10',
    proximoPrazo: '2025-10-22',
  },
  {
    id: '3',
    numeroProcesso: '5555555-55.2024.8.26.0224',
    cliente: 'Pedro Henrique Alves',
    tipo: 'Família',
    area: 'Direito de Família',
    objeto: 'Divórcio Consensual',
    valor: '-',
    status: 'finalizado',
    comarca: 'Guarulhos',
    vara: 'Vara de Família',
    dataDistribuicao: '2024-08-20',
    proximoPrazo: '-',
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
  suspenso: { label: 'Suspenso', color: 'bg-yellow-100 text-yellow-700' },
  arquivado: { label: 'Arquivado', color: 'bg-gray-100 text-gray-700' },
  finalizado: { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
};

export default function Processos() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [processos] = useState(processosMock);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const processosFiltrados = processos.filter(proc => {
    const matchBusca = proc.numeroProcesso.includes(busca) ||
                      proc.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      proc.objeto.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || proc.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const processosComPrazo = processos.filter(p => {
    if (p.proximoPrazo === '-') return false;
    const prazo = new Date(p.proximoPrazo);
    const hoje = new Date();
    const diff = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 7 && diff >= 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Processos</h1>
              <p className="text-sm text-orange-200">Painel Administrativo</p>
            </div>
          </div>
          <Button onClick={() => alert('Novo processo')} className="bg-white text-orange-700 hover:bg-orange-50">
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {processosComPrazo.length > 0 && (
          <Card className="mb-6 border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                Prazos Próximos (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {processosComPrazo.map(proc => (
                  <div key={proc.id} className="flex justify-between items-center bg-white p-3 rounded">
                    <div>
                      <div className="font-semibold">{proc.numeroProcesso}</div>
                      <div className="text-sm text-gray-600">{proc.objeto}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-orange-700">
                        {new Date(proc.proximoPrazo).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(proc.proximoPrazo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Processos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-10"
                    placeholder="Número do processo, cliente ou objeto..."
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
                  <option value="em_andamento">Em Andamento</option>
                  <option value="suspenso">Suspenso</option>
                  <option value="arquivado">Arquivado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-700">{processos.length}</div>
                <div className="text-sm text-gray-600">Total de Processos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {processos.filter(p => p.status === 'em_andamento').length}
                </div>
                <div className="text-sm text-gray-600">Em Andamento</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {processos.filter(p => p.status === 'finalizado').length}
                </div>
                <div className="text-sm text-gray-600">Finalizados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{processosComPrazo.length}</div>
                <div className="text-sm text-gray-600">Prazos Próximos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{processosFiltrados.length} processo(s) encontrado(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum processo encontrado</div>
              ) : (
                processosFiltrados.map((proc) => (
                  <div key={proc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <Scale className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{proc.numeroProcesso}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${statusLabels[proc.status].color}`}>
                              {statusLabels[proc.status].label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="font-medium text-gray-800">{proc.objeto}</div>
                            <div>Cliente: {proc.cliente}</div>
                            <div className="flex gap-4">
                              <span>Tipo: {proc.tipo}</span>
                              <span>Área: {proc.area}</span>
                            </div>
                            <div className="flex gap-4">
                              <span>Comarca: {proc.comarca}</span>
                              <span>Vara: {proc.vara}</span>
                            </div>
                            <div className="flex gap-4">
                              <span>Valor: {proc.valor}</span>
                              {proc.proximoPrazo !== '-' && (
                                <span className="text-orange-600 font-medium">
                                  Próximo prazo: {new Date(proc.proximoPrazo).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Distribuído em {new Date(proc.dataDistribuicao).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Ver processo ${proc.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => alert(`Editar processo ${proc.id}`)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

