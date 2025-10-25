import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Download, Eye, FileText, FileSignature, Filter } from 'lucide-react';

const documentosMock = [
  {
    id: 1,
    tipo: 'Procuração',
    cliente: 'João Silva Santos',
    cpf: '123.456.789-00',
    dataEmissao: '2025-10-15',
    status: 'Concluído',
    email: 'joao@email.com',
  },
  {
    id: 2,
    tipo: 'Contrato',
    cliente: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    dataEmissao: '2025-10-18',
    status: 'Concluído',
    email: 'maria@email.com',
  },
  {
    id: 3,
    tipo: 'Procuração',
    cliente: 'Pedro Henrique Alves',
    cpf: '456.789.123-00',
    dataEmissao: '2025-10-20',
    status: 'Concluído',
    email: 'pedro@email.com',
  },
];

export default function ListaDocumentos() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [documentos] = useState(documentosMock);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const documentosFiltrados = documentos.filter(doc => {
    const matchBusca = doc.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      doc.cpf.includes(busca) ||
                      doc.email.toLowerCase().includes(busca.toLowerCase());
    
    const matchTipo = filtroTipo === 'Todos' || doc.tipo === filtroTipo;
    
    return matchBusca && matchTipo;
  });

  const handleDownload = (id: number) => {
    alert(`Download do documento #${id} iniciado`);
  };

  const handleVisualizar = (id: number) => {
    alert(`Visualizando documento #${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/dashboard')} className="text-white hover:bg-purple-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Documentos Gerados</h1>
            <p className="text-sm text-purple-200">Painel Administrativo</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input className="pl-10" placeholder="Nome do cliente, CPF ou email..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
                <select className="w-full border rounded px-3 py-2" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option>Todos</option>
                  <option>Procuração</option>
                  <option>Contrato</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">{documentos.length}</div>
                <div className="text-sm text-gray-600">Total de Documentos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{documentos.filter(d => d.tipo === 'Procuração').length}</div>
                <div className="text-sm text-gray-600">Procurações</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{documentos.filter(d => d.tipo === 'Contrato').length}</div>
                <div className="text-sm text-gray-600">Contratos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{documentosFiltrados.length} documento(s) encontrado(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum documento encontrado</div>
              ) : (
                documentosFiltrados.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {doc.tipo === 'Procuração' ? <FileText className="w-8 h-8 text-blue-600" /> : <FileSignature className="w-8 h-8 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{doc.cliente}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${doc.tipo === 'Procuração' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {doc.tipo}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>CPF: {doc.cpf}</div>
                            <div>Email: {doc.email}</div>
                            <div>Data de Emissão: {new Date(doc.dataEmissao).toLocaleDateString('pt-BR')}</div>
                            <div>Status: <span className="text-green-600 font-medium">{doc.status}</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleVisualizar(doc.id)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id)}>
                          <Download className="w-4 h-4 mr-1" />
                          PDF
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

