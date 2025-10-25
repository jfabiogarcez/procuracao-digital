import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface PecaProcessual {
  id: string;
  titulo: string;
  tipo: string;
  status: string;
  numeroProcesso?: string;
  geradoPorIA: string;
  createdAt: string;
  updatedAt: string;
}

export default function PecasProcessuais() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pecas = [], isLoading: loading, refetch } = trpc.pecas.listar.useQuery({
    busca: searchTerm || undefined,
  });

  const deletarMutation = trpc.pecas.deletar.useMutation();

  async function deletarPeca(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta peça?")) return;

    try {
      await deletarMutation.mutateAsync({ id });

      toast.success("Peça excluída com sucesso");

      refetch();
    } catch (error: any) {
      toast.error(error.message || "Não foi possível excluir a peça");
    }
  }

  const pecasFiltradas = pecas.filter(
    (peca) =>
      peca.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peca.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peca.numeroProcesso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      peticao_inicial: "Petição Inicial",
      contestacao: "Contestação",
      recurso: "Recurso",
      peticao_intermediaria: "Petição Intermediária",
      memoriais: "Memoriais",
      agravo: "Agravo",
      apelacao: "Apelação",
      embargos: "Embargos",
      outro: "Outro",
    };
    return tipos[tipo] || tipo;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      rascunho: "secondary",
      revisao: "default",
      finalizado: "default",
      enviado: "default",
    };

    const labels: Record<string, string> = {
      rascunho: "Rascunho",
      revisao: "Em Revisão",
      finalizado: "Finalizado",
      enviado: "Enviado",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2847]">Peças Processuais</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas petições e peças processuais
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/admin/pecas/gerar-ia")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar com IA
          </Button>
          <Button
            onClick={() => navigate("/admin/pecas/nova")}
            className="bg-[#1a2847] hover:bg-[#2a3857]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Peça
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, tipo ou número do processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : pecasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma peça encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando sua primeira peça processual
              </p>
              <Button
                onClick={() => navigate("/admin/pecas/nova")}
                className="bg-[#1a2847] hover:bg-[#2a3857]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Peça
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IA</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pecasFiltradas.map((peca) => (
                  <TableRow key={peca.id}>
                    <TableCell className="font-medium">{peca.titulo}</TableCell>
                    <TableCell>{getTipoLabel(peca.tipo)}</TableCell>
                    <TableCell>{peca.numeroProcesso || "-"}</TableCell>
                    <TableCell>{getStatusBadge(peca.status)}</TableCell>
                    <TableCell>
                      {peca.geradoPorIA === "sim" && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(peca.updatedAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/pecas/${peca.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletarPeca(peca.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

