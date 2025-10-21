import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileCheck } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function FormularioContrato() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  
  const signatureClienteRef = useRef<SignatureCanvas>(null);
  const signatureAdvogadoRef = useRef<SignatureCanvas>(null);

  const [formData, setFormData] = useState({
    // Dados do Contratante (Cliente)
    clienteNome: "",
    clienteCpf: "",
    clienteRg: "",
    clienteEndereco: "",
    clienteTelefone: "",
    clienteEmail: "",
    
    // Objeto do Contrato
    objetoContrato: "",
    descricaoServicos: "",
    
    // Honorários
    valorHonorarios: "",
    formaPagemento: "À vista",
    numeroParcelas: "1",
    dataVencimento: "",
    
    // Prazo
    prazoContrato: "",
    dataInicio: new Date().toISOString().split('T')[0],
    dataTermino: "",
    
    // Cláusulas Adicionais
    clausulasAdicionais: "",
    
    // Assinaturas
    assinaturaCliente: "",
    assinaturaAdvogado: "",
    
    dataAssinatura: new Date().toISOString().split('T')[0]
  });

  // Dados do escritório
  const dadosEscritorio = {
    nome: "JFG Advocacia",
    responsavel: "Dr. José Fábio Garcez",
    oab: "OAB/SP 504.270",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua Exemplo, 123 - Centro",
    cidade: "São Paulo - SP",
    email: "documentos@jfg.adv.br",
    telefone: "(11) 1234-5678"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClearSignature = (type: 'cliente' | 'advogado') => {
    if (type === 'cliente') {
      signatureClienteRef.current?.clear();
    } else {
      signatureAdvogadoRef.current?.clear();
    }
  };

  const handleSaveSignature = (type: 'cliente' | 'advogado') => {
    if (type === 'cliente' && signatureClienteRef.current) {
      const signature = signatureClienteRef.current.toDataURL();
      setFormData(prev => ({ ...prev, assinaturaCliente: signature }));
      toast.success("Assinatura do cliente salva!");
    } else if (type === 'advogado' && signatureAdvogadoRef.current) {
      const signature = signatureAdvogadoRef.current.toDataURL();
      setFormData(prev => ({ ...prev, assinaturaAdvogado: signature }));
      toast.success("Assinatura do advogado salva!");
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.clienteNome || !formData.clienteCpf) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.assinaturaCliente || !formData.assinaturaAdvogado) {
      toast.error("Ambas as assinaturas são obrigatórias");
      return;
    }

    try {
      // TODO: Implementar salvamento no backend
      toast.success("Contrato gerado com sucesso!");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLocation("/admin");
    } catch (error) {
      toast.error("Erro ao gerar contrato");
    }
  };

  const qrCodeValue = `CONT-${Date.now()}`;

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
              <h1 className="text-lg font-semibold">Novo Contrato de Serviços</h1>
              <p className="text-xs text-muted-foreground">
                Etapa {step} de 4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs text-muted-foreground">
            <span>Cliente</span>
            <span>Serviços</span>
            <span>Assinaturas</span>
            <span>Revisão</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Step 1: Dados do Cliente */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Dados do Contratante</CardTitle>
                <CardDescription>
                  Informações do cliente que está contratando os serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="clienteNome">Nome Completo *</Label>
                    <Input
                      id="clienteNome"
                      name="clienteNome"
                      value={formData.clienteNome}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clienteCpf">CPF *</Label>
                    <Input
                      id="clienteCpf"
                      name="clienteCpf"
                      value={formData.clienteCpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clienteRg">RG</Label>
                    <Input
                      id="clienteRg"
                      name="clienteRg"
                      value={formData.clienteRg}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="clienteEndereco">Endereço Completo</Label>
                    <Input
                      id="clienteEndereco"
                      name="clienteEndereco"
                      value={formData.clienteEndereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro, cidade - UF"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clienteTelefone">Telefone *</Label>
                    <Input
                      id="clienteTelefone"
                      name="clienteTelefone"
                      value={formData.clienteTelefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="clienteEmail">Email *</Label>
                    <Input
                      id="clienteEmail"
                      name="clienteEmail"
                      type="email"
                      value={formData.clienteEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} size="lg">
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Objeto e Honorários */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Objeto do Contrato e Honorários</CardTitle>
                <CardDescription>
                  Descreva os serviços e valores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="objetoContrato">Objeto do Contrato *</Label>
                  <Input
                    id="objetoContrato"
                    name="objetoContrato"
                    value={formData.objetoContrato}
                    onChange={handleChange}
                    placeholder="Ex: Assessoria jurídica em processo trabalhista"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricaoServicos">Descrição Detalhada dos Serviços *</Label>
                  <Textarea
                    id="descricaoServicos"
                    name="descricaoServicos"
                    value={formData.descricaoServicos}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Descreva em detalhes os serviços que serão prestados..."
                    required
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">Honorários</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valorHonorarios">Valor Total *</Label>
                      <Input
                        id="valorHonorarios"
                        name="valorHonorarios"
                        value={formData.valorHonorarios}
                        onChange={handleChange}
                        placeholder="R$ 0,00"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="formaPagemento">Forma de Pagamento *</Label>
                      <select
                        id="formaPagemento"
                        name="formaPagemento"
                        value={formData.formaPagemento}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md"
                        required
                      >
                        <option value="À vista">À vista</option>
                        <option value="Parcelado">Parcelado</option>
                        <option value="Mensal">Mensal</option>
                        <option value="Êxito">Êxito</option>
                      </select>
                    </div>

                    {formData.formaPagemento === "Parcelado" && (
                      <>
                        <div>
                          <Label htmlFor="numeroParcelas">Número de Parcelas</Label>
                          <Input
                            id="numeroParcelas"
                            name="numeroParcelas"
                            type="number"
                            value={formData.numeroParcelas}
                            onChange={handleChange}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dataVencimento">Dia de Vencimento</Label>
                          <Input
                            id="dataVencimento"
                            name="dataVencimento"
                            type="number"
                            value={formData.dataVencimento}
                            onChange={handleChange}
                            placeholder="Ex: 10"
                            min="1"
                            max="31"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4">Prazo do Contrato</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prazoContrato">Prazo</Label>
                      <select
                        id="prazoContrato"
                        name="prazoContrato"
                        value={formData.prazoContrato}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md"
                      >
                        <option value="">Indeterminado</option>
                        <option value="3 meses">3 meses</option>
                        <option value="6 meses">6 meses</option>
                        <option value="12 meses">12 meses</option>
                        <option value="Até conclusão">Até conclusão do processo</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <Input
                        id="dataInicio"
                        name="dataInicio"
                        type="date"
                        value={formData.dataInicio}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dataTermino">Data de Término</Label>
                      <Input
                        id="dataTermino"
                        name="dataTermino"
                        type="date"
                        value={formData.dataTermino}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="clausulasAdicionais">Cláusulas Adicionais</Label>
                  <Textarea
                    id="clausulasAdicionais"
                    name="clausulasAdicionais"
                    value={formData.clausulasAdicionais}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Adicione cláusulas específicas se necessário..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button onClick={() => setStep(3)} size="lg">
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Assinaturas */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assinatura do Cliente</CardTitle>
                  <CardDescription>
                    O cliente deve assinar no campo abaixo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-4">
                    <SignatureCanvas
                      ref={signatureClienteRef}
                      canvasProps={{
                        className: "w-full h-48 bg-white rounded",
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleClearSignature('cliente')}>
                      Limpar
                    </Button>
                    <Button onClick={() => handleSaveSignature('cliente')}>
                      Salvar Assinatura do Cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assinatura do Advogado</CardTitle>
                  <CardDescription>
                    Assinatura do representante do escritório
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-4">
                    <SignatureCanvas
                      ref={signatureAdvogadoRef}
                      canvasProps={{
                        className: "w-full h-48 bg-white rounded",
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleClearSignature('advogado')}>
                      Limpar
                    </Button>
                    <Button onClick={() => handleSaveSignature('advogado')}>
                      Salvar Assinatura do Advogado
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  size="lg"
                  disabled={!formData.assinaturaCliente || !formData.assinaturaAdvogado}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Revisão */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revisão do Contrato</CardTitle>
                  <CardDescription>
                    Confira todos os dados antes de gerar o contrato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Partes */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Contratante (Cliente)</h3>
                      <div className="space-y-1 text-sm">
                        <div><strong>Nome:</strong> {formData.clienteNome}</div>
                        <div><strong>CPF:</strong> {formData.clienteCpf}</div>
                        <div><strong>Email:</strong> {formData.clienteEmail}</div>
                        <div><strong>Telefone:</strong> {formData.clienteTelefone}</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Contratado (Escritório)</h3>
                      <div className="space-y-1 text-sm">
                        <div><strong>Escritório:</strong> {dadosEscritorio.nome}</div>
                        <div><strong>Responsável:</strong> {dadosEscritorio.responsavel}</div>
                        <div><strong>OAB:</strong> {dadosEscritorio.oab}</div>
                        <div><strong>Email:</strong> {dadosEscritorio.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Objeto */}
                  <div>
                    <h3 className="font-semibold mb-2">Objeto do Contrato</h3>
                    <p className="text-sm">{formData.objetoContrato}</p>
                  </div>

                  {/* Honorários */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Honorários</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Valor:</div>
                      <div className="font-medium">{formData.valorHonorarios}</div>
                      <div className="text-muted-foreground">Forma de Pagamento:</div>
                      <div>{formData.formaPagemento}</div>
                    </div>
                  </div>

                  {/* Assinaturas */}
                  <div className="grid grid-cols-2 gap-4">
                    {formData.assinaturaCliente && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assinatura do Cliente:</h4>
                        <img src={formData.assinaturaCliente} alt="Assinatura Cliente" className="border rounded" />
                      </div>
                    )}
                    {formData.assinaturaAdvogado && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assinatura do Advogado:</h4>
                        <img src={formData.assinaturaAdvogado} alt="Assinatura Advogado" className="border rounded" />
                      </div>
                    )}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="text-center">
                      <h4 className="text-sm font-medium mb-2">QR Code do Contrato:</h4>
                      <QRCodeSVG value={qrCodeValue} size={128} />
                      <p className="text-xs text-muted-foreground mt-2">{qrCodeValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Voltar
                </Button>
                <Button onClick={handleSubmit} size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Gerar e Enviar Contrato
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

