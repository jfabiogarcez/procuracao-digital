import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowLeft, Loader2, Search, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";

export default function GerarPecaIA() {
  const [, navigate] = useLocation();

  const [tipo, setTipo] = useState("");
  const [contexto, setContexto] = useState("");
  const [partesEnvolvidas, setPartesEnvolvidas] = useState("");
  const [fundamentosJuridicos, setFundamentosJuridicos] = useState("");
  const [pedidos, setPedidos] = useState("");
  const [gerando, setGerando] = useState(false);
  const [conteudoGerado, setConteudoGerado] = useState("");
  const [jurisprudencias, setJurisprudencias] = useState<any[]>([]);
  const [buscandoJuris, setBuscandoJuris] = useState(false);

  const gerarMutation = trpc.pecas.gerarComIA.useMutation();
  const criarMutation = trpc.pecas.criar.useMutation();
  const buscarMutation = trpc.pecas.buscarJurisprudencias.useMutation();

  async function buscarJurisprudencias() {
    if (!contexto) {
      toast.error("Preencha o contexto do caso primeiro");
      return;
    }

    setBuscandoJuris(true);

    try {
      const result = await buscarMutation.mutateAsync({
        termo: contexto.substring(0, 100), // Primeiras 100 caracteres como termo de busca
        limite: 5,
      });

      setJurisprudencias(result.jurisprudencias);

      toast.success(`${result.jurisprudencias.length} jurisprudências encontradas no Jusbrasil`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar jurisprudências");
    } finally {
      setBuscandoJuris(false);
    }
  }

  async function gerarPecaComIA() {
    if (!tipo || !contexto) {
      toast.error("Preencha o tipo e o contexto do caso");
      return;
    }

    setGerando(true);

    try {
      // Adicionar jurisprudências ao contexto se houver
      let contextoCompleto = contexto;
      if (jurisprudencias.length > 0) {
        contextoCompleto += "\n\nJurisprudências para fundamentação:\n";
        jurisprudencias.forEach((juris) => {
          contextoCompleto += `\n- ${juris.tribunal} - ${juris.numero}\n  ${juris.ementa}\n`;
        });
      }

      const result = await gerarMutation.mutateAsync({
        tipo,
        contexto: contextoCompleto,
        partesEnvolvidas: partesEnvolvidas || undefined,
        fundamentosJuridicos: fundamentosJuridicos || undefined,
        pedidos: pedidos || undefined,
      });

      setConteudoGerado(result.conteudo);

      toast.success("Peça gerada com sucesso! Revise o conteúdo e salve quando estiver pronto");
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar peça. Tente novamente");
    } finally {
      setGerando(false);
    }
  }

  async function salvarPeca() {
    if (!conteudoGerado) {
      toast.error("Gere a peça primeiro antes de salvar");
      return;
    }

    try {
      const tipoLabel = getTipoLabel(tipo);
      const titulo = `${tipoLabel} - ${new Date().toLocaleDateString("pt-BR")}`;

      const result = await criarMutation.mutateAsync({
        titulo,
        tipo,
        conteudo: conteudoGerado,
        status: "rascunho",
        geradoPorIA: "sim",
        promptIA: contexto,
      });

      toast.success("Peça salva! Redirecionando para edição...");

      setTimeout(() => {
        navigate(`/admin/pecas/${result.id}`);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar peça");
    }
  }

  function getTipoLabel(tipo: string) {
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
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/pecas")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#1a2847] flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Gerar Peça com IA
          </h1>
          <p className="text-gray-600 mt-1">
            Preencha as informações e deixe a IA criar a peça processual
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Peça *</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peticao_inicial">Petição Inicial</SelectItem>
                    <SelectItem value="contestacao">Contestação</SelectItem>
                    <SelectItem value="recurso">Recurso</SelectItem>
                    <SelectItem value="peticao_intermediaria">Petição Intermediária</SelectItem>
                    <SelectItem value="memoriais">Memoriais</SelectItem>
                    <SelectItem value="agravo">Agravo</SelectItem>
                    <SelectItem value="apelacao">Apelação</SelectItem>
                    <SelectItem value="embargos">Embargos</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contexto">Contexto do Caso *</Label>
                <Textarea
                  id="contexto"
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  placeholder="Descreva os fatos relevantes do caso, cronologia, documentos importantes..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="partes">Partes Envolvidas</Label>
                <Textarea
                  id="partes"
                  value={partesEnvolvidas}
                  onChange={(e) => setPartesEnvolvidas(e.target.value)}
                  placeholder="Autor: [nome completo, qualificação]&#10;Réu: [nome completo, qualificação]"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="fundamentos">Fundamentos Jurídicos</Label>
                <Textarea
                  id="fundamentos"
                  value={fundamentosJuridicos}
                  onChange={(e) => setFundamentosJuridicos(e.target.value)}
                  placeholder="Artigos de lei, doutrinas, princípios aplicáveis..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pedidos">Pedidos</Label>
                <Textarea
                  id="pedidos"
                  value={pedidos}
                  onChange={(e) => setPedidos(e.target.value)}
                  placeholder="Liste os pedidos principais e subsidiários..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={buscarJurisprudencias}
                  disabled={buscandoJuris}
                  variant="outline"
                  className="flex-1"
                >
                  {buscandoJuris ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar Jurisprudências
                </Button>

                <Button
                  onClick={gerarPecaComIA}
                  disabled={gerando}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {gerando ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Gerar com IA
                </Button>
              </div>
            </CardContent>
          </Card>

          {jurisprudencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Jurisprudências Encontradas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jurisprudencias.map((juris, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-gray-50 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{juris.tribunal}</Badge>
                      <span className="text-sm font-medium">{juris.numero}</span>
                    </div>
                    <p className="text-sm text-gray-600">{juris.ementa}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Peça Gerada</CardTitle>
                {conteudoGerado && (
                  <Button
                    onClick={salvarPeca}
                    className="bg-[#1a2847] hover:bg-[#2a3857]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Peça
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!conteudoGerado ? (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Preencha as informações e clique em "Gerar com IA" para criar a peça</p>
                </div>
              ) : (
                <div className="prose max-w-none p-4 bg-white border rounded-lg min-h-[600px] overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: conteudoGerado }} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

