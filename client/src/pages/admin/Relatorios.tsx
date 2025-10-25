import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, FileText, TrendingUp, Download, Calendar } from 'lucide-react';

export default function Relatorios() {
  const [, setLocation] = useLocation();
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Dados mockados para os gráficos
  const documentosPorMes = [
    { mes: 'Jul', procuracoes: 8, contratos: 5 },
    { mes: 'Ago', procuracoes: 12, contratos: 7 },
    { mes: 'Set', procuracoes: 15, contratos: 9 },
    { mes: 'Out', procuracoes: 10, contratos: 6 },
  ];

  const processosPorArea = [
    { area: 'Civil', quantidade: 15, percentual: 35 },
    { area: 'Trabalhista', quantidade: 12, percentual: 28 },
    { area: 'Família', quantidade: 8, percentual: 19 },
    { area: 'Empresarial', quantidade: 5, percentual: 12 },
    { area: 'Outros', quantidade: 3, percentual: 7 },
  ];

  const receitasMensais = [
    { mes: 'Jul', valor: 85000 },
    { mes: 'Ago', valor: 120000 },
    { mes: 'Set', valor: 95000 },
    { mes: 'Out', valor: 150000 },
  ];

  const maxDocumentos = Math.max(...documentosPorMes.map(d => d.procuracoes + d.contratos));
  const maxReceita = Math.max(...receitasMensais.map(r => r.valor));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-purple-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Relatórios e Analytics</h1>
              <p className="text-sm text-purple-200">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              className="border rounded px-3 py-2 text-gray-800"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="ano">Último Ano</option>
            </select>
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Documentos Gerados</div>
                  <div className="text-3xl font-bold text-blue-600">42</div>
                  <div className="text-xs text-green-600 mt-1">+15% vs mês anterior</div>
                </div>
                <FileText className="w-10 h-10 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Processos Ativos</div>
                  <div className="text-3xl font-bold text-orange-600">43</div>
                  <div className="text-xs text-green-600 mt-1">+8% vs mês anterior</div>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Receita Total</div>
                  <div className="text-3xl font-bold text-green-600">R$ 450k</div>
                  <div className="text-xs text-green-600 mt-1">+25% vs mês anterior</div>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Clientes Ativos</div>
                  <div className="text-3xl font-bold text-indigo-600">28</div>
                  <div className="text-xs text-green-600 mt-1">+12% vs mês anterior</div>
                </div>
                <Calendar className="w-10 h-10 text-indigo-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Documentos por Mês */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Gerados por Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentosPorMes.map((item) => (
                  <div key={item.mes}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.mes}</span>
                      <span className="text-gray-600">{item.procuracoes + item.contratos} documentos</span>
                    </div>
                    <div className="flex gap-1 h-8">
                      <div 
                        className="bg-blue-500 rounded flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${(item.procuracoes / maxDocumentos) * 100}%` }}
                      >
                        {item.procuracoes > 0 && `${item.procuracoes}P`}
                      </div>
                      <div 
                        className="bg-green-500 rounded flex items-center justify-center text-white text-xs font-semibold"
                        style={{ width: `${(item.contratos / maxDocumentos) * 100}%` }}
                      >
                        {item.contratos > 0 && `${item.contratos}C`}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 text-xs mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Procurações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Contratos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processos por Área */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Processos por Área de Atuação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processosPorArea.map((item) => (
                  <div key={item.area}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.area}</span>
                      <span className="text-gray-600">{item.quantidade} ({item.percentual}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all"
                        style={{ width: `${item.percentual}%` }}
                      >
                        {item.percentual}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receitas Mensais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Receitas Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receitasMensais.map((item) => (
                  <div key={item.mes}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.mes}</span>
                      <span className="text-gray-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all"
                        style={{ width: `${(item.valor / maxReceita) * 100}%` }}
                      >
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(item.valor)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Relatórios Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Relatórios Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Gerar relatório de documentos')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Relatório de Documentos
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Gerar relatório de processos')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Relatório de Processos
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Gerar relatório financeiro')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Relatório Financeiro
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Gerar relatório de clientes')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Relatório de Clientes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

