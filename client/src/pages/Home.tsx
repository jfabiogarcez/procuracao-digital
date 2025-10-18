import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";

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
  });

  const signatureRef = useRef<SignatureCanvas>(null);
  const [photoData, setPhotoData] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const generateDocMutation = trpc.procuracao.generateDocument.useMutation({
    onSuccess: (data) => {
      // Download do documento
      const blob = new Blob(
        [Uint8Array.from(atob(data.document), c => c.charCodeAt(0))],
        { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Documento gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar documento: " + error.message);
    },
  });

  const createMutation = trpc.procuracao.create.useMutation({
    onSuccess: (data) => {
      toast.success("Procura\u00e7\u00e3o criada com sucesso!");
      // Gerar documento automaticamente
      generateDocMutation.mutate({ id: data.id });
    },
    onError: (error) => {
      toast.error("Erro ao criar procura\u00e7\u00e3o: " + error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error("Erro ao acessar câmera");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photo = canvas.toDataURL("image/jpeg");
        setPhotoData(photo);
        
        // Parar stream da câmera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Por favor, assine o documento");
      return;
    }

    const assinatura = signatureRef.current.toDataURL();

    createMutation.mutate({
      ...formData,
      assinatura,
      fotoAutenticacao: photoData || undefined,
    });
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JFG Advocacia</h1>
          <p className="text-lg text-gray-600">Sistema de Procuração Digital</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Procuração</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para gerar sua procuração digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Dados do Outorgante</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
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
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                        <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                        <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                        <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                        <SelectItem value="Aposentado">Aposentado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="profissao">Profissão *</Label>
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
                      onChange={(e) => handleInputChange("rg", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="numero">Número *</Label>
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
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000"
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
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value.toUpperCase())}
                      maxLength={2}
                      placeholder="SP"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Foto de Autenticação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Foto de Autenticação</h3>
                <div className="flex flex-col items-center gap-4">
                  {!photoData && !showCamera && (
                    <Button type="button" onClick={startCamera} variant="outline">
                      Tirar Foto
                    </Button>
                  )}
                  
                  {showCamera && (
                    <div className="flex flex-col items-center gap-2">
                      <video ref={videoRef} autoPlay className="w-64 h-48 border rounded" />
                      <Button type="button" onClick={capturePhoto}>
                        Capturar
                      </Button>
                    </div>
                  )}
                  
                  {photoData && (
                    <div className="flex flex-col items-center gap-2">
                      <img src={photoData} alt="Foto" className="w-32 h-32 object-cover rounded border" />
                      <Button type="button" onClick={() => setPhotoData("")} variant="outline" size="sm">
                        Tirar Nova Foto
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Outorgado (Pré-preenchido) */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Outorgado (Advogado)</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Nome:</strong> Dr. José Fábio Garcez</p>
                  <p><strong>OAB/SP:</strong> 504.270</p>
                  <p><strong>Endereço:</strong> Rua Capitão Antônio Rosa, nº 409, 1º Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010</p>
                  <p><strong>E-mail:</strong> jose.fabio.garcez@gmail.com</p>
                  <p><strong>Telefone:</strong> (11) 94721-9180</p>
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label>Data de Emissão</Label>
                <Input
                  value={new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Assinatura */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Assinatura Digital *</h3>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: "w-full h-48 bg-white",
                    }}
                  />
                </div>
                <Button type="button" onClick={clearSignature} variant="outline" size="sm">
                  Limpar Assinatura
                </Button>
              </div>

              {/* Botão de Envio */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {createMutation.isPending ? "Processando..." : "Salvar e Enviar Procuração"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Rua Capitão Antônio Rosa, 409, 1º Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010</p>
          <p>WhatsApp: (11) 9 4721-9180 / Tel. (11) 94721-9180</p>
          <p>E-mail: jose.fabio.garcez@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

