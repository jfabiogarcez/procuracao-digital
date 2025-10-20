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


export default function Procuracao() {
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
      toast.error("Por favor, preencha todos os campos obrigatorios!");
      return;
    }

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
      doc.text("PROCURACAO", pageWidth / 2, yPos, { align: "center" });
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
      doc.text(`Profissao: ${formData.profissao}`, margin, yPos);
      yPos += 7;
      doc.text(`RG: ${formData.rg}`, margin, yPos);
      yPos += 7;
      doc.text(`CPF: ${formData.cpf}`, margin, yPos);
      yPos += 7;
      doc.text(`E-mail: ${formData.email}`, margin, yPos);
      yPos += 7;
      doc.text(`Endereco: ${formData.endereco}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}`, margin, yPos);
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
      doc.text("Endereco: Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces", margin, yPos);
      yPos += 7;
      doc.text("Jardim Paulistano, Sao Paulo/SP, CEP 01443-010", margin, yPos);
      yPos += 7;
      doc.text("E-mail: jose.fabio.garcez@jfg.adv.br", margin, yPos);
      yPos += 7;
      doc.text("Telefone: (11) 94721-9180", margin, yPos);
      yPos += 15;

      // Texto da procuração
      doc.setFontSize(11);
      const texto = `Pelo presente instrumento particular de procuracao, o(a) OUTORGANTE acima qualificado(a) nomeia e constitui seu bastante procurador o Dr. Jose Fabio Garcez, advogado inscrito na OAB/SP sob o n 504.270, a quem confere amplos poderes para representa-lo(a) em juizo ou fora dele, podendo propor acoes, contestar, reconvir, desistir, transigir, firmar compromissos, receber e dar quitacao, requerer o que for de direito, inclusive poderes especiais para confessar, desistir, transigir, firmar compromisso, receber e dar quitacao, e praticar todos os atos necessarios ao bom e fiel desempenho do presente mandato.`;
      
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
      doc.text(`Sao Paulo, ${hoje}`, margin, yPos);
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
      const mensagem = `Ola Dr. Jose Fabio Garcez, segue a procuracao digital de ${formData.nomeCompleto}. O documento foi gerado e baixado.`;
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <div className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-blue-900">Procuracao Digital</CardTitle>
              <CardDescription className="text-center">
                Preencha os dados abaixo para gerar sua procuracao digital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados do Outorgante */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Dados do Outorgante</h3>
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
                          <SelectItem value="Uniao Estavel">Uniao Estavel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profissao">Profissao *</Label>
                      <Input
                        id="profissao"
                        value={formData.profissao}
                        onChange={(e) => handleInputChange("profissao", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rg">RG *</Label>
                      <Input
                        id="rg"
                        value={formData.rg}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("rg", value);
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("cpf", value);
                        }}
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

                {/* Endereco */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Endereco</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("cep", value);
                        }}
                        onBlur={handleCepBlur}
                        maxLength={8}
                        required
                      />
                    </div>
                    <div>
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
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => handleInputChange("estado", e.target.value)}
                        maxLength={2}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Testemunhas (Opcional) */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Testemunhas (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Testemunha 1</h4>
                      <div>
                        <Label htmlFor="testemunha1Nome">Nome</Label>
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
                          value={formData.testemunha1Cpf}
                          onChange={(e) => handleInputChange("testemunha1Cpf", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha1Rg">RG</Label>
                        <Input
                          id="testemunha1Rg"
                          value={formData.testemunha1Rg}
                          onChange={(e) => handleInputChange("testemunha1Rg", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Testemunha 2</h4>
                      <div>
                        <Label htmlFor="testemunha2Nome">Nome</Label>
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
                          value={formData.testemunha2Cpf}
                          onChange={(e) => handleInputChange("testemunha2Cpf", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testemunha2Rg">RG</Label>
                        <Input
                          id="testemunha2Rg"
                          value={formData.testemunha2Rg}
                          onChange={(e) => handleInputChange("testemunha2Rg", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foto */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Foto de Autenticacao (Opcional)</h3>
                  <div className="space-y-3">
                    <Button type="button" onClick={handlePhotoCapture} variant="outline">
                      Enviar Foto
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {photoData && (
                      <div className="mt-3">
                        <img src={photoData} alt="Foto" className="max-w-xs rounded border" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Assinatura */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">Assinatura Digital *</h3>
                  <div className="border-2 border-gray-300 rounded-lg">
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        className: "w-full h-40 cursor-crosshair",
                      }}
                    />
                  </div>
                  <Button type="button" onClick={clearSignature} variant="outline" className="mt-2">
                    Limpar Assinatura
                  </Button>
                </div>

                {/* Botao de Envio */}
                <Button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold text-lg py-6"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Gerando PDF..." : "Gerar Procuracao"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog WhatsApp */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procuracao Gerada com Sucesso!</DialogTitle>
            <DialogDescription>
              Seu documento foi gerado e baixado. Deseja enviar para o advogado via WhatsApp?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                window.open(whatsappLink, "_blank");
                setShowWhatsAppDialog(false);
              }}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              Enviar via WhatsApp
            </Button>
            <Button onClick={() => setShowWhatsAppDialog(false)} variant="outline" className="flex-1">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

