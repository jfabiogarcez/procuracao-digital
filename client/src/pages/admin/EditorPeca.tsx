import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function EditorPeca() {
  const params = useParams();
  const pecaId = params.id as string;
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [peca, setPeca] = useState({
    titulo: "",
    tipo: "peticao_inicial",
    conteudo: "",
    numeroProcesso: "",
    status: "rascunho",
    tags: "",
  });

  const { data: pecaData, isLoading } = trpc.pecas.obter.useQuery(
    { id: pecaId },
    { enabled: !!pecaId && pecaId !== "nova" }
  );

  const atualizarMutation = trpc.pecas.atualizar.useMutation();
  const criarMutation = trpc.pecas.criar.useMutation();

  useEffect(() => {
    if (pecaData) {
      setPeca({
        titulo: pecaData.titulo,
        tipo: pecaData.tipo,
        conteudo: pecaData.conteudo,
        numeroProcesso: pecaData.numeroProcesso || "",
        status: pecaData.status,
        tags: "",
      });
    }
  }, [pecaData]);

  async function exportarWord() {
    if (!peca.conteudo) {
      toast.error("Não há conteúdo para exportar");
      return;
    }

    try {
      // Criar blob com conteúdo HTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${peca.titulo}</title>
        </head>
        <body>
          <h1>${peca.titulo}</h1>
          <p><strong>Tipo:</strong> ${peca.tipo}</p>
          <p><strong>Número do Processo:</strong> ${peca.numeroProcesso || 'N/A'}</p>
          <hr>
          ${peca.conteudo}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${peca.titulo.replace(/[^a-z0-9]/gi, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Arquivo HTML exportado! Abra no Word para converter.");
    } catch (error: any) {
      toast.error("Erro ao exportar arquivo");
    }
  }

  async function salvarPeca() {
    if (!peca.titulo || !peca.conteudo) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      if (pecaId === "nova") {
        const result = await criarMutation.mutateAsync({
          titulo: peca.titulo,
          tipo: peca.tipo,
          conteudo: peca.conteudo,
          numeroProcesso: peca.numeroProcesso || undefined,
          status: peca.status,
        });

        toast.success("Peça criada com sucesso");

        navigate(`/admin/pecas/${result.id}`);
      } else {
        await atualizarMutation.mutateAsync({
          id: pecaId,
          titulo: peca.titulo,
          conteudo: peca.conteudo,
          status: peca.status,
          numeroProcesso: peca.numeroProcesso || undefined,
        });

        toast.success("Peça atualizada com sucesso");
      }
    } catch (error: any) {
      toast.error(error.message || "Não foi possível salvar a peça");
    } finally {
      setLoading(false);
    }
  }

  const tipos = [
    { value: "peticao_inicial", label: "Petição Inicial" },
    { value: "contestacao", label: "Contestação" },
    { value: "recurso", label: "Recurso" },
    { value: "peticao_intermediaria", label: "Petição Intermediária" },
    { value: "memoriais", label: "Memoriais" },
    { value: "agravo", label: "Agravo" },
    { value: "apelacao", label: "Apelação" },
    { value: "embargos", label: "Embargos" },
    { value: "outro", label: "Outro" },
  ];

  const statusOptions = [
    { value: "rascunho", label: "Rascunho" },
    { value: "revisao", label: "Em Revisão" },
    { value: "finalizado", label: "Finalizado" },
    { value: "enviado", label: "Enviado" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/pecas")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#1a2847]">
            {pecaId && pecaId !== "nova" ? "Editar Peça" : "Nova Peça"}
          </h1>
          <p className="text-gray-600 mt-1">
            Redija sua peça processual
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Peça</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={peca.titulo}
                  onChange={(e) => setPeca({ ...peca, titulo: e.target.value })}
                  placeholder="Ex: Petição Inicial - Ação de Cobrança"
                />
              </div>

              <div>
                <Label htmlFor="conteudo">Conteúdo *</Label>
                <Textarea
                  id="conteudo"
                  value={peca.conteudo}
                  onChange={(e) => setPeca({ ...peca, conteudo: e.target.value })}
                  placeholder="Digite ou cole o conteúdo da peça processual..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Peça *</Label>
                <Select
                  value={peca.tipo}
                  onValueChange={(value) => setPeca({ ...peca, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numeroProcesso">Número do Processo</Label>
                <Input
                  id="numeroProcesso"
                  value={peca.numeroProcesso}
                  onChange={(e) =>
                    setPeca({ ...peca, numeroProcesso: e.target.value })
                  }
                  placeholder="0000000-00.0000.0.00.0000"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={peca.status}
                  onValueChange={(value) => setPeca({ ...peca, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={peca.tags}
                  onChange={(e) => setPeca({ ...peca, tags: e.target.value })}
                  placeholder="civil, cobrança, urgente"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={salvarPeca}
                disabled={loading}
                className="w-full bg-[#1a2847] hover:bg-[#2a3857]"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Salvando..." : "Salvar Peça"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={exportarWord}
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar Word
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

