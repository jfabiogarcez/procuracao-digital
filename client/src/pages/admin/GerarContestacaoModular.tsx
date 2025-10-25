import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Save,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface SecaoContestacao {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  ordem: number;
  status: 'pendente' | 'gerando' | 'gerado' | 'aprovado' | 'rejeitado';
  jurisprudencias?: any[];
}

export default function GerarContestacaoModular() {
  const [, navigate] = useLocation();
  const [analise, setAnalise] = useState<any>(null);
  const [plano, setPlano] = useState<any>(null);
  const [secoes, setSecoes] = useState<SecaoContestacao[]>([]);
  const [secaoEditando, setSecaoEditando] = useState<string | null>(null);
  const [conteudoEditado, setConteudoEditado] = useState("");
  const [gerando, setGerando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const criarPlanoMutation = trpc.pecas.criarPlanoContestacao.useMutation();
  const gerarSecaoMutation = trpc.pecas.gerarSecaoContestacao.useMutation();
  const montarFinalMutation = trpc.pecas.montarContestacaoFinal.useMutation();
  const criarPecaMutation = trpc.pecas.criar.useMutation();

  useEffect(() => {
    // Recuperar análise do sessionStorage
    const analiseStr = sessionStorage.getItem('analise_peticao');
    if (analiseStr) {
      const analiseData = JSON.parse(analiseStr);
      setAnalise(analiseData);
      criarPlano(analiseData);
    } else {
      toast.error("Análise não encontrada. Faça upload da petição novamente.");
      navigate("/admin/pecas/gerar-contestacao");
    }
  }, []);

  async function criarPlano(analiseData: any) {
    try {
      const resultado = await criarPlanoMutation.mutateAsync({
        analise: analiseData,
      });

      setPlano(resultado.plano);
      setSecoes(resultado.plano.secoes);
      toast.success("Plano de contestação criado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar plano");
    }
  }

  async function gerarTodasSecoes() {
    setGerando(true);
    setProgresso(0);

    const secoesParaGerar = secoes.filter(s => s.status === 'pendente');
    const total = secoesParaGerar.length;

    for (let i = 0; i < secoesParaGerar.length; i++) {
      const secao = secoesParaGerar[i];
      
      // Atualizar status para "gerando"
      setSecoes(prev => prev.map(s => 
        s.id === secao.id ? { ...s, status: 'gerando' as const } : s
      ));

      try {
        const resultado = await gerarSecaoMutation.mutateAsync({
          secao,
          analise,
          secaoPeticao: analise.secoes.find((s: any) => s.tipo === secao.tipo),
        });

        // Atualizar com conteúdo gerado
        setSecoes(prev => prev.map(s => 
          s.id === secao.id ? resultado.secao : s
        ));

        toast.success(`Seção "${secao.titulo}" gerada!`);
      } catch (error: any) {
        toast.error(`Erro ao gerar "${secao.titulo}": ${error.message}`);
        
        // Marcar como rejeitada
        setSecoes(prev => prev.map(s => 
          s.id === secao.id ? { ...s, status: 'rejeitado' as const } : s
        ));
      }

      setProgresso(((i + 1) / total) * 100);
    }

    setGerando(false);
    toast.success("Todas as seções foram geradas!");
  }

  function aprovarSecao(id: string) {
    setSecoes(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'aprovado' as const } : s
    ));
    toast.success("Seção aprovada!");
  }

  function rejeitarSecao(id: string) {
    setSecoes(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'rejeitado' as const } : s
    ));
    toast.info("Seção rejeitada. Você pode editá-la ou regerar.");
  }

  function iniciarEdicao(secao: SecaoContestacao) {
    setSecaoEditando(secao.id);
    setConteudoEditado(secao.conteudo);
  }

  function salvarEdicao() {
    if (!secaoEditando) return;

    setSecoes(prev => prev.map(s => 
      s.id === secaoEditando 
        ? { ...s, conteudo: conteudoEditado, status: 'gerado' as const } 
        : s
    ));

    setSecaoEditando(null);
    setConteudoEditado("");
    toast.success("Edição salva!");
  }

  async function finalizarContestacao() {
    const secoesAprovadas = secoes.filter(s => s.status === 'aprovado');

    if (secoesAprovadas.length === 0) {
      toast.error("Aprove pelo menos uma seção antes de finalizar");
      return;
    }

    try {
      toast.info("Montando contestação final...");

      const resultado = await montarFinalMutation.mutateAsync({
        secoes: secoesAprovadas,
        analise,
      });

      // Salvar como peça processual
      const pecaResult = await criarPecaMutation.mutateAsync({
        titulo: `Contestação - ${analise.partes.autor || 'Processo'}`,
        tipo: 'contestacao',
        conteudo: resultado.contestacao,
        numeroProcesso: analise.numeroProcesso,
        status: 'revisao',
        geradoPorIA: 'sim',
        promptIA: `Gerado por Manus AI a partir de ${secoesAprovadas.length} seções`,
      });

      toast.success("Contestação finalizada e salva!");
      navigate(`/admin/pecas/${pecaResult.id}`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao finalizar contestação");
    }
  }

  if (!plano) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#1a2847]" />
            <p>Criando plano de contestação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const secoesAprovadas = secoes.filter(s => s.status === 'aprovado').length;
  const secoesGeradas = secoes.filter(s => s.status === 'gerado').length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1a2847]">
          Geração Modular de Contestação
        </h1>
        <p className="text-gray-600 mt-2">
          {plano.resumoEstrategia}
        </p>
      </div>

      {/* Barra de Progresso */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              Progresso: {secoesAprovadas}/{secoes.length} seções aprovadas
            </span>
            <span className="text-sm text-gray-600">
              {secoesGeradas} geradas, aguardando aprovação
            </span>
          </div>
          <Progress value={(secoesAprovadas / secoes.length) * 100} />
        </CardContent>
      </Card>

      {/* Ações Globais */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={gerarTodasSecoes}
          disabled={gerando || secoes.every(s => s.status !== 'pendente')}
          className="bg-[#1a2847] hover:bg-[#2a3857]"
        >
          {gerando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando... {Math.round(progresso)}%
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Todas as Seções
            </>
          )}
        </Button>

        <Button
          onClick={finalizarContestacao}
          disabled={secoesAprovadas === 0}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <FileText className="w-4 h-4 mr-2" />
          Finalizar Contestação ({secoesAprovadas} seções)
        </Button>
      </div>

      {/* Lista de Seções */}
      <div className="space-y-4">
        {secoes.map((secao) => (
          <Card key={secao.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">
                    {secao.ordem}
                  </span>
                  <div>
                    <CardTitle className="text-lg">{secao.titulo}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{secao.tipo}</Badge>
                      <Badge
                        variant={
                          secao.status === 'aprovado' ? 'default' :
                          secao.status === 'gerado' ? 'secondary' :
                          secao.status === 'gerando' ? 'secondary' :
                          secao.status === 'rejeitado' ? 'destructive' :
                          'outline'
                        }
                      >
                        {secao.status === 'aprovado' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {secao.status === 'gerando' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                        {secao.status === 'rejeitado' && <XCircle className="w-3 h-3 mr-1" />}
                        {secao.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {secao.status === 'gerado' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => iniciarEdicao(secao)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600"
                      onClick={() => rejeitarSecao(secao.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => aprovarSecao(secao.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            {(secao.status === 'gerado' || secao.status === 'aprovado') && (
              <CardContent>
                {secaoEditando === secao.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={conteudoEditado}
                      onChange={(e) => setConteudoEditado(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={salvarEdicao}>
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSecaoEditando(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: secao.conteudo }}
                  />
                )}

                {secao.jurisprudencias && secao.jurisprudencias.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">
                      Jurisprudências utilizadas:
                    </p>
                    <div className="space-y-2">
                      {secao.jurisprudencias.map((j, i) => (
                        <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                          <strong>{j.tribunal}</strong> - {j.numero}
                          <p className="text-gray-600 mt-1">{j.ementa.substring(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

