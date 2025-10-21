import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Camera, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function FormularioProcuracao() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  
  const signatureRef = useRef<SignatureCanvas>(null);
  const webcamRef = useRef<Webcam>(null);

  const [formData, setFormData] = useState({
    // Dados do Outorgante (Cliente)
    nomeCompleto: "",
    nacionalidade: "brasileiro(a)",
    estadoCivil: "",
    profissao: "",
    rg: "",
    cpf: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    email: "",
    telefone: "",
    
    // Testemunhas
    testemunha1Nome: "",
    testemunha1Cpf: "",
    testemunha1Rg: "",
    testemunha2Nome: "",
    testemunha2Cpf: "",
    testemunha2Rg: "",
    
    // Assinatura e foto
    assinatura: "",
    foto: "",
    
    // Data
    dataEmissao: new Date().toISOString().split('T')[0]
  });

  // Dados pré-preenchidos do advogado
  const dadosAdvogado = {
    nome: "Dr. José Fábio Garcez",
    oab: "OAB/SP 504.270",
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

  const handleClearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      const signature = signatureRef.current.toDataURL();
      setFormData(prev => ({ ...prev, assinatura: signature }));
      toast.success("Assinatura salva!");
      setStep(4);
    }
  };

  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      if (photo) {
        setFormData(prev => ({ ...prev, foto: photo }));
        setPhotoTaken(true);
        setShowCamera(false);
        toast.success("Foto capturada!");
      }
    }
  };

  const handleSubmit = async () => {
    // Validações básicas
    if (!formData.nomeCompleto || !formData.cpf || !formData.rg) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.assinatura) {
      toast.error("Assinatura é obrigatória");
      return;
    }

    try {
      // TODO: Implementar salvamento no backend via tRPC
      toast.success("Procuração gerada com sucesso!");
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLocation("/admin");
    } catch (error) {
      toast.error("Erro ao gerar procuração");
    }
  };

  const qrCodeValue = `PROC-${Date.now()}`;

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
              <h1 className="text-lg font-semibold">Nova Procuração</h1>
              <p className="text-xs text-muted-foreground">
                Etapa {step} de 4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
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
            <span>Dados Pessoais</span>
            <span>Endereço</span>
            <span>Assinatura</span>
            <span>Revisão</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais do Outorgante</CardTitle>
                <CardDescription>
                  Preencha os dados da pessoa que está outorgando os poderes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                    <Input
                      id="nacionalidade"
                      name="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil *</Label>
                    <select
                      id="estadoCivil"
                      name="estadoCivil"
                      value={formData.estadoCivil}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="solteiro(a)">Solteiro(a)</option>
                      <option value="casado(a)">Casado(a)</option>
                      <option value="divorciado(a)">Divorciado(a)</option>
                      <option value="viúvo(a)">Viúvo(a)</option>
                      <option value="união estável">União Estável</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="profissao">Profissão *</Label>
                    <Input
                      id="profissao"
                      name="profissao"
                      value={formData.profissao}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="rg">RG *</Label>
                    <Input
                      id="rg"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
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

          {/* Step 2: Endereço */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço do Outorgante</CardTitle>
                <CardDescription>
                  Informe o endereço completo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Logradouro *</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, Avenida, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      {/* Adicionar outros estados */}
                    </select>
                  </div>
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

          {/* Step 3: Assinatura */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Assinatura Digital</CardTitle>
                <CardDescription>
                  Assine no campo abaixo usando o mouse ou dedo (em dispositivos touch)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-lg p-4">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: "w-full h-48 bg-white rounded",
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClearSignature}>
                    Limpar Assinatura
                  </Button>
                  <Button variant="outline" onClick={() => setShowCamera(!showCamera)}>
                    <Camera className="h-4 w-4 mr-2" />
                    {photoTaken ? "Tirar Nova Foto" : "Capturar Foto"}
                  </Button>
                </div>

                {showCamera && (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full"
                      />
                    </div>
                    <Button onClick={handleTakePhoto} className="w-full">
                      Capturar Foto
                    </Button>
                  </div>
                )}

                {formData.foto && !showCamera && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Foto capturada:</p>
                    <img src={formData.foto} alt="Foto" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button onClick={handleSaveSignature} size="lg">
                    Salvar e Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Revisão */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revisão dos Dados</CardTitle>
                  <CardDescription>
                    Confira todos os dados antes de gerar a procuração
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dados do Outorgante */}
                  <div>
                    <h3 className="font-semibold mb-3">Outorgante (Cliente)</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Nome:</div>
                      <div>{formData.nomeCompleto}</div>
                      <div className="text-muted-foreground">CPF:</div>
                      <div>{formData.cpf}</div>
                      <div className="text-muted-foreground">RG:</div>
                      <div>{formData.rg}</div>
                      <div className="text-muted-foreground">Endereço:</div>
                      <div>{formData.endereco}, {formData.numero} - {formData.bairro}</div>
                    </div>
                  </div>

                  {/* Dados do Advogado */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Outorgado (Advogado)</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Nome:</div>
                      <div>{dadosAdvogado.nome}</div>
                      <div className="text-muted-foreground">OAB:</div>
                      <div>{dadosAdvogado.oab}</div>
                      <div className="text-muted-foreground">Email:</div>
                      <div>{dadosAdvogado.email}</div>
                    </div>
                  </div>

                  {/* Assinatura e Foto */}
                  <div className="grid grid-cols-2 gap-4">
                    {formData.assinatura && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assinatura:</h4>
                        <img src={formData.assinatura} alt="Assinatura" className="border rounded" />
                      </div>
                    )}
                    {formData.foto && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Foto de Autenticação:</h4>
                        <img src={formData.foto} alt="Foto" className="w-32 h-32 object-cover border rounded" />
                      </div>
                    )}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="text-center">
                      <h4 className="text-sm font-medium mb-2">QR Code do Documento:</h4>
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
                  Gerar e Enviar Procuração
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

