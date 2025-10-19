import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

export default function Home() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nacionalidade: "Brasileiro(a)",
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
    // Testemunhas
    testemunha1Nome: "",
    testemunha1Cpf: "",
    testemunha1Rg: "",
    testemunha2Nome: "",
    testemunha2Cpf: "",
    testemunha2Rg: "",
  });

  const signatureRef = useRef<SignatureCanvas>(null);
  const [photoData, setPhotoData] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const generatePDF = () => {
    // Validação
    if (!formData.nomeCompleto || !formData.estadoCivil || !formData.profissao || 
        !formData.rg || !formData.cpf || !formData.email || !formData.cep || 
        !formData.endereco || !formData.numero || !formData.bairro || 
        !formData.cidade || !formData.estado) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Foto opcional para teste
    // if (!photoData) {
    //   toast.error("Por favor, envie uma foto de autenticação!");
    //   return;
    // }

    if (signatureRef.current?.isEmpty()) {
      toast.error("Por favor, assine o documento!");
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Título
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("PROCURAÇÃO", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Dados do Outorgante
      doc.setFontSize(14);
      doc.text("OUTORGANTE", margin, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Nome: ${formData.nomeCompleto}`, margin, yPos);
      yPos += 7;
      doc.text(`Nacionalidade: ${formData.nacionalidade}`, margin, yPos);
      yPos += 7;
      doc.text(`Estado Civil: ${formData.estadoCivil}`, margin, yPos);
      yPos += 7;
      doc.text(`Profissão: ${formData.profissao}`, margin, yPos);
      yPos += 7;
      doc.text(`RG: ${formData.rg}`, margin, yPos);
      yPos += 7;
      doc.text(`CPF: ${formData.cpf}`, margin, yPos);
      yPos += 7;
      doc.text(`E-mail: ${formData.email}`, margin, yPos);
      yPos += 7;
      doc.text(`Endereço: ${formData.endereco}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}`, margin, yPos);
      yPos += 7;
      doc.text(`Bairro: ${formData.bairro}, ${formData.cidade}/${formData.estado}`, margin, yPos);
      yPos += 7;
      doc.text(`CEP: ${formData.cep}`, margin, yPos);
      yPos += 15;

      // Dados do Outorgado
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OUTORGADO (ADVOGADO)", margin, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Nome: Dr. Jose Fabio Garcez", margin, yPos);
      yPos += 7;
      doc.text("OAB/SP: 504.270", margin, yPos);
      yPos += 7;
      doc.text("Endereço: Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces", margin, yPos);
      yPos += 7;
      doc.text("Jardim Paulistano, Sao Paulo/SP, CEP 01443-010", margin, yPos);
      yPos += 7;
      doc.text("E-mail: jose.fabio.garcez@gmail.com", margin, yPos);
      yPos += 7;
      doc.text("Telefone: (11) 94721-9180", margin, yPos);
      yPos += 15;

      // Texto da procuração
      doc.setFontSize(11);
      const texto = `Pelo presente instrumento particular de procuração, o(a) OUTORGANTE acima qualificado(a) nomeia e constitui seu bastante procurador o Dr. Jose Fabio Garcez, advogado inscrito na OAB/SP sob o nº 504.270, a quem confere amplos poderes para representá-lo(a) em juízo ou fora dele, podendo propor ações, contestar, reconvir, desistir, transigir, firmar compromissos, receber e dar quitação, requerer o que for de direito, inclusive poderes especiais para confessar, desistir, transigir, firmar compromisso, receber e dar quitação, e praticar todos os atos necessários ao bom e fiel desempenho do presente mandato.`;
      
      const lines = doc.splitTextToSize(texto, pageWidth - 2 * margin);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 7 + 10;

      // Testemunhas (se houver)
      if (formData.testemunha1Nome || formData.testemunha2Nome) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("TESTEMUNHAS", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        if (formData.testemunha1Nome) {
          doc.text(`1. ${formData.testemunha1Nome}`, margin, yPos);
          yPos += 7;
          if (formData.testemunha1Cpf) doc.text(`   CPF: ${formData.testemunha1Cpf}`, margin, yPos);
          yPos += 7;
          if (formData.testemunha1Rg) doc.text(`   RG: ${formData.testemunha1Rg}`, margin, yPos);
          yPos += 10;
        }

        if (formData.testemunha2Nome) {
          doc.text(`2. ${formData.testemunha2Nome}`, margin, yPos);
          yPos += 7;
          if (formData.testemunha2Cpf) doc.text(`   CPF: ${formData.testemunha2Cpf}`, margin, yPos);
          yPos += 7;
          if (formData.testemunha2Rg) doc.text(`   RG: ${formData.testemunha2Rg}`, margin, yPos);
          yPos += 10;
        }
      }

      // Data
      yPos += 10;
      const hoje = new Date().toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      doc.text(`São Paulo, ${hoje}`, margin, yPos);
      yPos += 15;

      // Assinatura
      if (signatureRef.current) {
        const signatureData = signatureRef.current.toDataURL();
        doc.addImage(signatureData, 'PNG', margin, yPos, 60, 20);
      }
      yPos += 25;
      doc.text("_".repeat(40), margin, yPos);
      yPos += 7;
      doc.text(formData.nomeCompleto, margin, yPos);

      // Salvar PDF
      const filename = `procuracao_${formData.nomeCompleto.replace(/\s/g, '_')}_${Date.now()}.pdf`;
      doc.save(filename);

      toast.success("PDF gerado com sucesso!");

      // Preparar link do WhatsApp
      const mensagem = `Olá Dr. Jose Fabio Garcez, segue a procuração digital de ${formData.nomeCompleto}. O documento foi gerado e baixado.`;
      const whatsappUrl = `https://wa.me/5511947219180?text=${encodeURIComponent(mensagem)}`;
      setWhatsappLink(whatsappUrl);
      setShowWhatsAppDialog(true);

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Procuracao</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para gerar sua procuracao digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Outorgante */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Dados do Outorgante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                    <Input
                      id="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                    <Input
                      id="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={(e) => handleInputChange("nacionalidade", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil *</Label>
                    <Select
                      value={formData.estadoCivil}
                      onValueChange={(value) => handleInputChange("estadoCivil", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                        <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                        <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                        <SelectItem value="Viuvo(a)">Viuvo(a)</SelectItem>
                        <SelectItem value="Aposentado">Aposentado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profissao">Profissao *</Label>
                    <Select
                      value={formData.profissao}
                      onValueChange={(value) => handleInputChange("profissao", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Advogado(a)">Advogado(a)</SelectItem>
                        <SelectItem value="Medico(a)">Medico(a)</SelectItem>
                        <SelectItem value="Engenheiro(a)">Engenheiro(a)</SelectItem>
                        <SelectItem value="Professor(a)">Professor(a)</SelectItem>
                        <SelectItem value="Contador(a)">Contador(a)</SelectItem>
                        <SelectItem value="Arquiteto(a)">Arquiteto(a)</SelectItem>
                        <SelectItem value="Enfermeiro(a)">Enfermeiro(a)</SelectItem>
                        <SelectItem value="Administrador(a)">Administrador(a)</SelectItem>
                        <SelectItem value="Empresario(a)">Empresario(a)</SelectItem>
                        <SelectItem value="Comerciante">Comerciante</SelectItem>
                        <SelectItem value="Funcionario(a) Publico(a)">Funcionario(a) Publico(a)</SelectItem>
                        <SelectItem value="Aposentado(a)">Aposentado(a)</SelectItem>
                        <SelectItem value="Autonomo(a)">Autonomo(a)</SelectItem>
                        <SelectItem value="Estudante">Estudante</SelectItem>
                        <SelectItem value="Do lar">Do lar</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rg">RG *</Label>
                    <Input
                      id="rg"
                      placeholder="Somente numeros"
                      value={formData.rg}
                      onChange={(e) => handleInputChange("rg", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="Somente numeros (11 digitos)"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Endereco</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      placeholder="Somente numeros (8 digitos)"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      onBlur={handleCepBlur}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Logradouro *</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Numero *</Label>
                    <Input
                      id="numero"
                      placeholder="Somente numeros"
                      value={formData.numero}
                      onChange={(e) => handleInputChange("numero", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => handleInputChange("complemento", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange("bairro", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado (UF) *</Label>
                    <Input
                      id="estado"
                      placeholder="SP"
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Foto de Autenticação */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Foto de Autenticacao *</h3>
                <p className="text-sm text-gray-600 mb-4">
                  * Campo obrigatorio - Tire uma foto segurando seu documento de identidade para autenticacao
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" onClick={handlePhotoCapture} variant="outline">
                  Tirar/Enviar Foto
                </Button>
                {photoData && (
                  <div className="mt-4">
                    <img src={photoData} alt="Foto de autenticacao" className="max-w-xs rounded-lg shadow-md" />
                  </div>
                )}
              </div>

              {/* Testemunhas */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Testemunhas (Opcional, mas Recomendado)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  A inclusao de testemunhas aumenta a seguranca juridica do documento
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Testemunha 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="testemunha1Nome">Nome Completo</Label>
                        <Input
                          id="testemunha1Nome"
                          value={formData.testemunha1Nome}
                          onChange={(e) => handleInputChange("testemunha1Nome", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha1Cpf">CPF</Label>
                        <Input
                          id="testemunha1Cpf"
                          placeholder="Somente numeros (11 digitos)"
                          value={formData.testemunha1Cpf}
                          onChange={(e) => handleInputChange("testemunha1Cpf", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha1Rg">RG</Label>
                        <Input
                          id="testemunha1Rg"
                          placeholder="Somente numeros"
                          value={formData.testemunha1Rg}
                          onChange={(e) => handleInputChange("testemunha1Rg", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Testemunha 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="testemunha2Nome">Nome Completo</Label>
                        <Input
                          id="testemunha2Nome"
                          value={formData.testemunha2Nome}
                          onChange={(e) => handleInputChange("testemunha2Nome", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha2Cpf">CPF</Label>
                        <Input
                          id="testemunha2Cpf"
                          placeholder="Somente numeros (11 digitos)"
                          value={formData.testemunha2Cpf}
                          onChange={(e) => handleInputChange("testemunha2Cpf", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha2Rg">RG</Label>
                        <Input
                          id="testemunha2Rg"
                          placeholder="Somente numeros"
                          value={formData.testemunha2Rg}
                          onChange={(e) => handleInputChange("testemunha2Rg", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados do Advogado */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Outorgado (Advogado)</h3>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> Dr. Jose Fabio Garcez</p>
                  <p><strong>OAB/SP:</strong> 504.270</p>
                  <p><strong>Endereco:</strong> Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010</p>
                  <p><strong>E-mail:</strong> jose.fabio.garcez@gmail.com</p>
                  <p><strong>Telefone:</strong> (11) 94721-9180</p>
                </div>
              </div>

              {/* Data de Emissão */}
              <div>
                <Label htmlFor="dataEmissao">Data de Emissao</Label>
                <Input
                  id="dataEmissao"
                  value={new Date().toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                  disabled
                />
              </div>

              {/* Assinatura Digital */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Assinatura Digital *</h3>
                <div className="border-2 border-gray-300 rounded-lg">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: "w-full h-40 rounded-lg",
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={clearSignature}
                  variant="outline"
                  className="mt-2"
                >
                  Limpar Assinatura
                </Button>
              </div>

              <div className="border-t pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Gerando PDF..." : "Salvar e Enviar Procuracao"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Dialog do WhatsApp */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procuração Gerada com Sucesso!</DialogTitle>
            <DialogDescription>
              O PDF da procuração foi gerado e baixado. Agora você pode enviar para o advogado via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clique no botão abaixo para abrir o WhatsApp e enviar a procuração para o Dr. Jose Fabio Garcez.
            </p>
            <Button
              onClick={() => {
                window.open(whatsappLink, "_blank");
                setShowWhatsAppDialog(false);
              }}
              className="w-full"
            >
              Abrir WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

