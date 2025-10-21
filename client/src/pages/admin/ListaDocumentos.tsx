import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Mail, 
  FileText,
  FileCheck,
  Plus,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

// Tipo de documento mock
interface Documento {
  id: string;
  tipo: "procuracao" | "contrato";
  numero: string;
  clienteNome: string;
  clienteCpf: string;
  status: "rascunho" | "gerado" | "enviado" | "assinado";
  dataGeracao: string;
  emailEnviado: boolean;
}

export default function ListaDocumentos() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  // Dados mock - em produção virão do backend
  const documentosMock: Documento[] = [
    {
      id: "1",
      tipo: "procuracao",
      numero: "PROC-2025-001",
      clienteNome: "João Silva Santos",
      clienteCpf: "123.456.789-00",
      status: "enviado",
      dataGeracao: "2025-10-20",
      emailEnviado: true
    },
    {
      id: "2",
      tipo: "contrato",
      numero: "CONT-2025-001",
      clienteNome: "Maria Oliveira Costa",
      clienteCpf: "987.654.321-00",
      status: "assinado",
      dataGeracao: "2025-10-19",
      emailEnviado: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      rascunho: "bg-gray-100 text-gray-800",
      gerado: "bg-blue-100 text-blue-800",
      enviado: "bg-green-100 text-green-800",
      assinado: "bg-purple-100 text-purple-800"
    };
    return badges[status as keyof typeof badges] || badges.rascunho;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      rascunho: "Rascunho",
      gerado: "Gerado",
      enviado: "Enviado",
      assinado: "Assinado"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "procuracao" ? FileText : FileCheck;
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === "procuracao" ? "Procuração" : "Contrato";
  };

  const filteredDocumentos = documentosMock.filter(doc => {
    const matchSearch = doc.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doc.clienteCpf.includes(searchTerm) ||
                       doc.numero.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = filterTipo === "todos" || doc.tipo === filterTipo;
    const matchStatus = filterStatus === "todos" || doc.status === filterStatus;
    
    return matchSearch && matchTipo && matchStatus;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Documentos</h1>
              <p className="text-xs text-muted-foreground">
                {filteredDocumentos.length} documento(s) encontrado(s)
              </p>
            </div>
          </div>
          <Button onClick={() => setLocation("/admin/documentos/novo")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, CPF ou número..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="procuracao">Procuração</option>
                    <option value="contrato">Contrato</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="rascunho">Rascunho</option>
                    <option value="gerado">Gerado</option>
                    <option value="enviado">Enviado</option>
                    <option value="assinado">Assinado</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Documentos */}
          {filteredDocumentos.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum documento encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filterTipo !== "todos" || filterStatus !== "todos"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando seu primeiro documento"}
                </p>
                <Button onClick={() => setLocation("/admin/documentos/novo")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Documento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos.map((doc) => {
                const TipoIcon = getTipoIcon(doc.tipo);
                
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            doc.tipo === "procuracao" ? "bg-blue-100" : "bg-green-100"
                          }`}>
                            <TipoIcon className={`h-6 w-6 ${
                              doc.tipo === "procuracao" ? "text-blue-600" : "text-green-600"
                            }`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{doc.clienteNome}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(doc.status)}`}>
                                {getStatusLabel(doc.status)}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <div className="font-medium text-foreground">Tipo</div>
                                <div>{getTipoLabel(doc.tipo)}</div>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">Número</div>
                                <div>{doc.numero}</div>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">CPF</div>
                                <div>{doc.clienteCpf}</div>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">Data</div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(doc.dataGeracao).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            </div>

                            {doc.emailEnviado && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                                <Mail className="h-3 w-3" />
                                <span>Email enviado com sucesso</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          {doc.emailEnviado && (
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Reenviar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Estatísticas */}
          {filteredDocumentos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{filteredDocumentos.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredDocumentos.filter(d => d.tipo === "procuracao").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Procurações</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredDocumentos.filter(d => d.tipo === "contrato").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Contratos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredDocumentos.filter(d => d.status === "assinado").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Assinados</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

