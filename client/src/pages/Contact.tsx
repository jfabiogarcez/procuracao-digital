import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast.error("Por favor, preencha todos os campos obrigatorios!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio (em producao, integrar com servico de e-mail)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      
      // Limpar formulario
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por telefone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Entre em Contato</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Estamos prontos para atender voce e encontrar a melhor solucao para seu caso
          </p>
        </div>
      </section>

      {/* Conteudo Principal */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Envie sua Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulario abaixo e entraremos em contato o mais breve possivel.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        placeholder="Seu nome completo"
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
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="assunto">Assunto</Label>
                      <Input
                        id="assunto"
                        value={formData.assunto}
                        onChange={(e) => handleInputChange("assunto", e.target.value)}
                        placeholder="Assunto da mensagem"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        value={formData.mensagem}
                        onChange={(e) => handleInputChange("mensagem", e.target.value)}
                        placeholder="Descreva brevemente seu caso ou duvida..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informacoes de Contato */}
            <div className="space-y-6">
              <Card className="shadow-lg border-t-4 border-t-amber-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Informacoes de Contato</CardTitle>
                  <CardDescription>
                    Entre em contato conosco atraves de qualquer um dos canais abaixo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Endereco</h3>
                      <p className="text-gray-700">
                        Rua Capitao Antonio Rosa, n 409, 1 Andar<br />
                        Edificio Spaces<br />
                        Jardim Paulistano<br />
                        Sao Paulo/SP - CEP 01443-010
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Telefone / WhatsApp</h3>
                      <a
                        href="tel:+5511947219180"
                        className="text-gray-700 hover:text-amber-500 transition-colors"
                      >
                        (11) 94721-9180
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">E-mail</h3>
                      <a
                        href="mailto:jose.fabio.garcez@jfg.adv.br"
                        className="text-gray-700 hover:text-amber-500 transition-colors break-all"
                      >
                        jose.fabio.garcez@jfg.adv.br
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Horario de Atendimento</h3>
                      <p className="text-gray-700">
                        Segunda a Sexta: 9h00 as 18h00<br />
                        Sabado: Mediante agendamento<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Atendimento Urgente</h3>
                  <p className="text-blue-100 mb-4">
                    Para casos urgentes, entre em contato via WhatsApp para um atendimento mais rapido.
                  </p>
                  <a
                    href="https://wa.me/5511947219180"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                      Chamar no WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Procuracao Digital</h3>
                  <p className="text-gray-700 mb-4">
                    Precisa de uma procuracao? Utilize nosso sistema digital para gerar seu documento de forma rapida e segura.
                  </p>
                  <a href="/procuracao">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold">
                      Acessar Procuracao Digital
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa (Placeholder) */}
      <section className="py-0 px-0 bg-white">
        <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Mapa de Localizacao</p>
            <p className="text-gray-500 text-sm">Jardim Paulistano, Sao Paulo/SP</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

