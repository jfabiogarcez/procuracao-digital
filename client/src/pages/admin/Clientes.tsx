import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Plus, User, Edit, Eye } from 'lucide-react';

const clientesMock = [
  {
    id: '1',
    nomeCompleto: 'João Silva Santos',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    telefone: '(11) 98765-4321',
    status: 'ativo',
    totalDocumentos: 3,
    totalProcessos: 1,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    nomeCompleto: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    email: 'maria@email.com',
    telefone: '(11) 91234-5678',
    status: 'ativo',
    totalDocumentos: 2,
    totalProcessos: 2,
    createdAt: '2025-02-20',
  },
];

export default function Clientes() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState('');
  const [clientes] = useState(clientesMock);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cpf.includes(busca) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-indigo-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
              <p className="text-sm text-indigo-200">Painel Administrativo</p>
            </div>
          </div>
          <Button onClick={() => setLocation('/admin/clientes/novo')} className="bg-white text-indigo-700 hover:bg-indigo-50">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="pl-10"
                placeholder="Nome, CPF ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-700">{clientes.length}</div>
                <div className="text-sm text-gray-600">Total de Clientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {clientes.filter(c => c.status === 'ativo').length}
                </div>
                <div className="text-sm text-gray-600">Clientes Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {clientes.reduce((acc, c) => acc + c.totalProcessos, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Processos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{clientesFiltrados.length} cliente(s) encontrado(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum cliente encontrado</div>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <div key={cliente.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <User className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{cliente.nomeCompleto}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              cliente.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {cliente.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>CPF: {cliente.cpf}</div>
                            <div>Email: {cliente.email}</div>
                            <div>Telefone: {cliente.telefone}</div>
                            <div className="flex gap-4 mt-2">
                              <span className="text-blue-600 font-medium">{cliente.totalDocumentos} documentos</span>
                              <span className="text-purple-600 font-medium">{cliente.totalProcessos} processos</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Cliente desde {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Ver cliente ${cliente.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => alert(`Editar cliente ${cliente.id}`)}>
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

