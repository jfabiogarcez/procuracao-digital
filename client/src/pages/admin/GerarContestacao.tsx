import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface SecaoAnalise {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  ordem: number;
}

interface AnalisePeticao {
  secoes: SecaoAnalise[];
  partes: {
    autor?: string;
    reu?: string;
    outros?: string[];
  };
  resumo: string;
  numeroProcesso?: string;
  tribunal?: string;
  vara?: string;
}

export default function GerarContestacao() {
  const [, navigate] = useLocation();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [analise, setAnalise] = useState<AnalisePeticao | null>(null);
  const [progresso, setProgresso] = useState(0);
  const [etapaAtual, setEtapaAtual] = useState("");

  const uploadMutation = trpc.pecas.uploadPeticao.useMutation();

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Por favor, selecione um arquivo PDF");
      return;
    }

    setArquivo(file);
  }

  async function processarPeticao() {
    if (!arquivo) {
      toast.error("Selecione um arquivo PDF primeiro");
      return;
    }

    setProcessando(true);
    setProgresso(0);
    setEtapaAtual("Lendo arquivo PDF...");

    try {
      // Ler arquivo como base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(arquivo);
      });

      setProgresso(20);
      setEtapaAtual("Extraindo texto do PDF...");

      // Enviar para backend
      const resultado = await uploadMutation.mutateAsync({
        pdfBase64: fileData,
        nomeArquivo: arquivo.name,
      });

      setProgresso(60);
      setEtapaAtual("Analisando estrutura da petição...");

      // Simular progresso da análise
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgresso(100);
      setEtapaAtual("Análise concluída!");

      setAnalise(resultado.analise);

      // Salvar análise no sessionStorage para próxima página
      sessionStorage.setItem('analise_peticao', JSON.stringify(resultado.analise));

      toast.success(`Petição analisada com sucesso! ${resultado.numPages} páginas processadas.`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar petição");
    } finally {
      setProcessando(false);
    }
  }

  async function gerarContestacao() {
    if (!analise) return;

    // Navegar para página de geração modular
    navigate("/admin/pecas/gerar-contestacao-modular");
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1a2847]">Gerar Contestação</h1>
        <p className="text-gray-600 mt-2">
          Faça upload da petição inicial recebida para gerar automaticamente a contestação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Upload */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload da Petição Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                  disabled={processando}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileText className="w-12 h-12 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {arquivo ? arquivo.name : "Clique para selecionar um PDF"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Sem limite de páginas
                  </span>
                </label>
              </div>

              {arquivo && !processando && !analise && (
                <Button
                  onClick={processarPeticao}
                  className="w-full bg-[#1a2847] hover:bg-[#2a3857]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Processar Petição
                </Button>
              )}

              {processando && (
                <div className="space-y-2">
                  <Progress value={progresso} />
                  <p className="text-sm text-center text-gray-600 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {etapaAtual}
                  </p>
                </div>
              )}

              {analise && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Análise concluída!</span>
                  </div>
                  <Button
                    onClick={gerarContestacao}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Gerar Contestação
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Análise */}
        <div>
          {analise && (
            <Card>
              <CardHeader>
                <CardTitle>Análise da Petição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resumo */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">Resumo</h3>
                  <p className="text-sm text-gray-600">{analise.resumo}</p>
                </div>

                {/* Partes */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">Partes</h3>
                  <div className="space-y-1 text-sm">
                    {analise.partes.autor && (
                      <p>
                        <strong>Autor:</strong> {analise.partes.autor}
                      </p>
                    )}
                    {analise.partes.reu && (
                      <p>
                        <strong>Réu:</strong> {analise.partes.reu}
                      </p>
                    )}
                  </div>
                </div>

                {/* Processo */}
                {analise.numeroProcesso && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">Processo</h3>
                    <p className="text-sm text-gray-600">{analise.numeroProcesso}</p>
                    {analise.tribunal && (
                      <p className="text-xs text-gray-500">{analise.tribunal}</p>
                    )}
                  </div>
                )}

                {/* Seções Identificadas */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">
                    Seções Identificadas ({analise.secoes.length})
                  </h3>
                  <div className="space-y-2">
                    {analise.secoes.map((secao) => (
                      <div
                        key={secao.id}
                        className="border rounded p-2 text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{secao.titulo}</span>
                          <Badge variant="outline">{secao.tipo}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {secao.conteudo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!analise && !processando && (
            <Card>
              <CardContent className="p-12 text-center text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>Faça upload de uma petição inicial para ver a análise</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

