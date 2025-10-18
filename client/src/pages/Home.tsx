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

  const generateDocMutation = trpc.procuracao.generateDocument.useMutation({
    onSuccess: (data) => {
      // Download do documento PDF
      const blob = new Blob(
        [Uint8Array.from(atob(data.document), c => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Documento PDF gerado com sucesso!");
      
      // Mostrar dialog do WhatsApp
      if (data.whatsappLink) {
        setWhatsappLink(data.whatsappLink);
        setShowWhatsAppDialog(true);
      }
    },
    onError: (error) => {
      toast.error("Erro ao gerar documento: " + error.message);
    },
  });

  const createMutation = trpc.procuracao.create.useMutation({
    onSuccess: (data) => {
      toast.success("Procuracao criada com sucesso!");
      // Gerar documento automaticamente
      generateDocMutation.mutate({ id: data.id });
    },
    onError: (error) => {
      toast.error("Erro ao criar procuracao: " + error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buscarEnderecoPorCep = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
          toast.success("Endereco encontrado!");
        } else {
          toast.error("CEP nao encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  const getGeolocation = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(`${position.coords.latitude},${position.coords.longitude}`);
          },
          () => resolve(null)
        );
      } else {
        resolve(null);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Por favor, assine o documento");
      return;
    }

    // Validacao: Foto obrigatoria
    if (!photoData) {
      toast.error("A foto de autenticacao e obrigatoria! Tire uma foto segurando seu documento.");
      return;
    }

    const assinatura = signatureRef.current.toDataURL();

    // Capturar metadados de seguranca
    const ipAddress = await getClientIP();
    const userAgent = navigator.userAgent;
    const geolocalizacao = await getGeolocation();

    createMutation.mutate({
      ...formData,
      assinatura,
      fotoAutenticacao: photoData,
      ipAddress: ipAddress || undefined,
      userAgent,
      geolocalizacao: geolocalizacao || undefined,
    });
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo-jfg.png" alt="JFG Advocacia" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JFG Advocacia</h1>
          <p className="text-lg text-gray-600">Sistema de Procuracao Digital</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Procuracao</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para gerar sua procuracao digital
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
                      required
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
                      value={formData.rg}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange("rg", value);
                      }}
                      placeholder="Somente numeros"
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
                        if (value.length <= 11) {
                          handleInputChange("cpf", value);
                        }
                      }}
                      placeholder="Somente numeros (11 digitos)"
                      maxLength={11}
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

              {/* Endereco */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Endereco</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 8) {
                          handleInputChange("cep", value);
                          if (value.length === 8) {
                            buscarEnderecoPorCep(value);
                          }
                        }
                      }}
                      placeholder="Somente numeros (8 digitos)"
                      maxLength={8}
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
                      value={formData.numero}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange("numero", value);
                      }}
                      placeholder="Somente numeros"
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
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value.toUpperCase())}
                      maxLength={2}
                      placeholder="SP"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Foto de Autenticacao */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Foto de Autenticacao *</h3>
                <p className="text-sm text-red-600">
                  * Campo obrigatorio - Tire uma foto segurando seu documento de identidade para autenticacao
                </p>
                <div className="flex flex-col items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  
                  {!photoData && (
                    <Button type="button" onClick={triggerFileInput} variant="outline">
                      Tirar/Enviar Foto
                    </Button>
                  )}
                  
                  {photoData && (
                    <div className="flex flex-col items-center gap-2">
                      <img src={photoData} alt="Foto" className="w-48 h-48 object-cover rounded border" />
                      <Button type="button" onClick={() => setPhotoData("")} variant="outline" size="sm">
                        Trocar Foto
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Testemunhas */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Testemunhas (Opcional, mas Recomendado)</h3>
                <p className="text-sm text-gray-600">
                  A inclusao de testemunhas aumenta a seguranca juridica do documento
                </p>
                
                {/* Testemunha 1 */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Testemunha 1</h4>
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
                        maxLength={11}
                        value={formData.testemunha1Cpf}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("testemunha1Cpf", value);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="testemunha1Rg">RG</Label>
                      <Input
                        id="testemunha1Rg"
                        placeholder="Somente numeros"
                        value={formData.testemunha1Rg}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("testemunha1Rg", value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Testemunha 2 */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Testemunha 2</h4>
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
                        maxLength={11}
                        value={formData.testemunha2Cpf}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("testemunha2Cpf", value);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="testemunha2Rg">RG</Label>
                      <Input
                        id="testemunha2Rg"
                        placeholder="Somente numeros"
                        value={formData.testemunha2Rg}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          handleInputChange("testemunha2Rg", value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Outorgado (Pre-preenchido) */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Outorgado (Advogado)</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Nome:</strong> Dr. Jose Fabio Garcez</p>
                  <p><strong>OAB/SP:</strong> 504.270</p>
                  <p><strong>Endereco:</strong> Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010</p>
                  <p><strong>E-mail:</strong> jose.fabio.garcez@gmail.com</p>
                  <p><strong>Telefone:</strong> (11) 94721-9180</p>
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label>Data de Emissao</Label>
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
                
                {/* Nome Completo apos assinatura */}
                <div className="border-t pt-4 mt-4">
                  <Label htmlFor="nomeAssinatura">Nome Completo *</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Repita seu nome completo para confirmar a assinatura
                  </p>
                  <Input
                    id="nomeAssinatura"
                    value={formData.nomeCompleto}
                    disabled
                    className="bg-gray-50 font-semibold"
                  />
                </div>
              </div>

              {/* Aviso Legal */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Importante - Validade Juridica
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Esta procuracao e valida nos termos da Lei 14.063/2020</li>
                  <li>• Para plena validade, recomenda-se reconhecimento de firma em cartorio</li>
                  <li>• A inclusao de testemunhas aumenta a seguranca juridica</li>
                  <li>• A foto com documento e obrigatoria para autenticacao</li>
                  <li>• Seus dados de localizacao e IP serao registrados para seguranca</li>
                </ul>
              </div>

              {/* Botao de Envio */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {createMutation.isPending ? "Processando..." : "Salvar e Enviar Procuracao"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Rodape */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Rua Capitao Antonio Rosa, 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010</p>
          <p>WhatsApp: (11) 9 4721-9180 / Tel. (11) 94721-9180</p>
          <p>E-mail: jose.fabio.garcez@gmail.com</p>
        </div>
      </div>

      {/* Dialog do WhatsApp */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Documento Gerado com Sucesso!</DialogTitle>
            <DialogDescription>
              Seu documento PDF foi gerado e baixado. Clique no botao abaixo para enviar via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={() => {
                window.open(whatsappLink, "_blank");
                setShowWhatsAppDialog(false);
              }}
              className="w-full"
              size="lg"
            >
              Enviar via WhatsApp
            </Button>
            <Button
              onClick={() => setShowWhatsAppDialog(false)}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

