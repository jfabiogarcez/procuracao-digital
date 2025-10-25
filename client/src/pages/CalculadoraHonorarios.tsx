import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, ArrowLeft, Info } from "lucide-react";
import { areasAtuacao, getServicosPorArea, formatarValor, type ServicoOAB } from "@/../../shared/data/tabelaOAB";

export default function CalculadoraHonorarios() {
  const [areaSelecionada, setAreaSelecionada] = useState<string>("");
  const [servicoSelecionado, setServicoSelecionado] = useState<ServicoOAB | null>(null);
  const [valorPersonalizado, setValorPersonalizado] = useState<string>("");
  const [servicosDisponiveis, setServicosDisponiveis] = useState<ServicoOAB[]>([]);

  const handleAreaChange = (area: string) => {
    setAreaSelecionada(area);
    setServicoSelecionado(null);
    setValorPersonalizado("");
    setServicosDisponiveis(getServicosPorArea(area));
  };

  const handleServicoChange = (servicoId: string) => {
    const servico = servicosDisponiveis.find(s => s.id === servicoId);
    setServicoSelecionado(servico || null);
    setValorPersonalizado("");
  };

  const calcularPercentual = () => {
    if (!servicoSelecionado || !servicoSelecionado.percentual) return "";
    const valorCausa = parseFloat(valorPersonalizado.replace(/\D/g, "")) / 100;
    if (isNaN(valorCausa) || valorCausa === 0) return "";
    const valorCalculado = (valorCausa * servicoSelecionado.percentual) / 100;
    return formatarValor(Math.max(valorCalculado, servicoSelecionado.valorMinimo));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-12" />
          </div>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-[#1a2847]" />
            <h1 className="text-4xl font-bold text-[#1a2847]">
              Calculadora de Honorários
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Consulte os valores de referência da Tabela OAB/SP 2025
          </p>
        </div>

        {/* Aviso Importante */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">Importante:</p>
                <p>
                  Os valores apresentados são <strong>referências mínimas</strong> sugeridas pela OAB/SP.
                  Você tem total liberdade para negociar valores diferentes de acordo com a complexidade
                  do caso, sua experiência e as condições do cliente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculadora */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Consultar Valores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Área */}
            <div className="space-y-2">
              <Label htmlFor="area">Área do Direito</Label>
              <Select value={areaSelecionada} onValueChange={handleAreaChange}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecione a área de atuação" />
                </SelectTrigger>
                <SelectContent>
                  {areasAtuacao.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Serviço */}
            {areaSelecionada && (
              <div className="space-y-2">
                <Label htmlFor="servico">Tipo de Serviço</Label>
                <Select 
                  value={servicoSelecionado?.id || ""} 
                  onValueChange={handleServicoChange}
                >
                  <SelectTrigger id="servico">
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicosDisponiveis.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Resultado */}
            {servicoSelecionado && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-[#1a2847] mb-2">
                    {servicoSelecionado.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {servicoSelecionado.descricao}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-[#1a2847]">
                    <div className="text-sm text-gray-600 mb-1">Valor Mínimo OAB</div>
                    <div className="text-2xl font-bold text-[#1a2847]">
                      {formatarValor(servicoSelecionado.valorMinimo)}
                    </div>
                  </div>

                  {servicoSelecionado.percentual && (
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-300">
                      <div className="text-sm text-gray-600 mb-1">Percentual Sugerido</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {servicoSelecionado.percentual}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculadora de Percentual */}
                {servicoSelecionado.percentual && (
                  <div className="mt-4 space-y-3">
                    <Label htmlFor="valorCausa">Valor da Causa (opcional)</Label>
                    <Input
                      id="valorCausa"
                      type="text"
                      placeholder="R$ 0,00"
                      value={valorPersonalizado}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, "");
                        const formatado = new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(parseFloat(valor) / 100 || 0);
                        setValorPersonalizado(formatado);
                      }}
                    />
                    {valorPersonalizado && calcularPercentual() && (
                      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
                        <div className="text-sm text-green-700 mb-1">
                          Honorários Calculados ({servicoSelecionado.percentual}%)
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {calcularPercentual()}
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          * Respeitando o valor mínimo da tabela OAB
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Seu Valor */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <Label htmlFor="seuValor" className="text-blue-900">
                    Seu Valor Negociado (opcional)
                  </Label>
                  <Input
                    id="seuValor"
                    type="text"
                    placeholder="R$ 0,00"
                    className="mt-2 bg-white"
                  />
                  <p className="text-xs text-blue-700 mt-2">
                    Este é o valor que você vai cobrar do cliente. Pode ser diferente da tabela OAB.
                  </p>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            {servicoSelecionado && (
              <div className="flex gap-4 mt-6">
                <Button 
                  className="flex-1 bg-[#1a2847] hover:bg-[#2a3857]"
                  onClick={() => window.location.href = '/contrato'}
                >
                  Gerar Contrato
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  Imprimir
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Tabela de Honorários OAB/SP 2025 - Atualizada em Janeiro/2025
          </p>
          <p className="mt-2">
            Para mais informações, consulte:{" "}
            <a 
              href="https://www.oabsp.org.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1a2847] hover:underline"
            >
              www.oabsp.org.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

