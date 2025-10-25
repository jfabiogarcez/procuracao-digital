import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileSignature, LogOut, List, Users, Scale, DollarSign, BarChart3, Calculator, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');
    setLocation('/admin/login');
  };

  const adminEmail = localStorage.getItem('admin_email') || 'Administrador';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">JFG ADVOCACIA</h1>
            <p className="text-sm text-blue-200">Painel Administrativo</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{adminEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white hover:bg-blue-800">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao Painel</h2>
          <p className="text-gray-600">Gerencie documentos jurídicos de forma eficiente</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/procuracao/nova')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Nova Procuração
              </CardTitle>
              <CardDescription>Criar procuração digital com assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-900 hover:bg-blue-800">Criar Procuração</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/contrato/novo')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="w-6 h-6 text-green-600" />
                Novo Contrato
              </CardTitle>
              <CardDescription>Criar contrato de serviços advocatícios</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-700 hover:bg-green-600">Criar Contrato</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/documentos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-6 h-6 text-purple-600" />
                Documentos
              </CardTitle>
              <CardDescription>Ver todos os documentos gerados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-700 hover:bg-purple-600">Ver Documentos</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/clientes')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                Clientes
              </CardTitle>
              <CardDescription>Gerenciar cadastro de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-indigo-700 hover:bg-indigo-600">Ver Clientes</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/processos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-orange-600" />
                Processos
              </CardTitle>
              <CardDescription>Acompanhar processos judiciais</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-700 hover:bg-orange-600">Ver Processos</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/financeiro')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Financeiro
              </CardTitle>
              <CardDescription>Controle de honorários e pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-700 hover:bg-green-600">Ver Financeiro</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/relatorios')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                Relatórios
              </CardTitle>
              <CardDescription>Analytics e relatórios gerenciais</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-700 hover:bg-purple-600">Ver Relatórios</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/calculadora')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                Calculadora OAB
              </CardTitle>
              <CardDescription>Calcular honorários conforme tabela OAB</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-700 hover:bg-blue-600">Abrir Calculadora</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/pecas')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Peças Processuais
              </CardTitle>
              <CardDescription>Redigir petições com assistente IA</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Ver Peças</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

