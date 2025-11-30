import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Shield, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function HomeLanding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio (sem tRPC por enquanto)
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="container flex items-center justify-between h-20">
          <div className="flex items-center">
            <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-16 w-16" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-sm font-medium hover:text-primary transition-colors">Sobre</a>
            <a href="#areas" className="text-sm font-medium hover:text-primary transition-colors">Áreas de Atuação</a>
            <a href="#equipe" className="text-sm font-medium hover:text-primary transition-colors">Equipe</a>
            <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors">Contato</a>
          </div>
          <Button asChild>
            <a href="#contato">Agende uma Consulta</a>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-image.jpeg" 
            alt="Escritório moderno" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">JFG</span><br/>
              <span className="text-primary text-4xl md:text-5xl">Advocacia & Consultoria Jurídica</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Soluções jurídicas personalizadas com compromisso, ética e resultados. 
              Defendemos seus direitos com dedicação e profissionalismo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href="#contato">Fale Conosco</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#areas">Nossas Especialidades</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Sobre Nós</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Com mais de 20 anos de experiência, nosso escritório se consolidou como referência 
                em assessoria jurídica de excelência. Atuamos com foco em resultados, oferecendo 
                soluções estratégicas e personalizadas para cada cliente.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Nossa equipe é formada por advogados especializados e comprometidos com a defesa 
                dos interesses de nossos clientes, sempre pautados pela ética, transparência e 
                profissionalismo.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <div className="text-sm text-muted-foreground">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/images/about-image.jpg" 
                alt="Sobre o escritório" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação Section */}
      <section id="areas" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Áreas de Atuação</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos assessoria jurídica completa em diversas áreas do direito, 
              sempre com excelência e dedicação.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Direito Civil",
                description: "Contratos, indenizações, responsabilidade civil e questões patrimoniais."
              },
              {
                icon: Shield,
                title: "Direito Empresarial",
                description: "Constituição de empresas, contratos comerciais e consultoria corporativa."
              },
              {
                icon: FileText,
                title: "Direito Trabalhista",
                description: "Defesa em ações trabalhistas, acordos e consultoria preventiva."
              },
              {
                icon: FileText,
                title: "Direito Tributário",
                description: "Planejamento tributário, recuperação de créditos e defesas fiscais."
              },
              {
                icon: Users,
                title: "Direito de Família",
                description: "Divórcio, guarda, pensão alimentícia e inventários."
              },
              {
                icon: Shield,
                title: "Direito Imobiliário",
                description: "Compra e venda, locação, regularização e usucapião."
              }
            ].map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <area.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                  <p className="text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe Section */}
      <section id="equipe" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profissionais altamente qualificados e comprometidos com a excelência 
              no atendimento e na defesa dos seus interesses.
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden">
                  <img src="/images/foto-jfg.jpg" alt="Dr. José Fabio Garcez" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Dr. José Fabio Garcez</h3>
                <p className="text-primary font-medium mb-3 text-lg">Sócio Fundador</p>
                <p className="text-sm text-muted-foreground mb-2">Direito do Trabalho e Direito Empresarial</p>
                <p className="text-xs text-muted-foreground">OAB/SP 504.270</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos prontos para atendê-lo. Agende uma consulta e conheça nossas soluções jurídicas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Nome Completo</label>
                      <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail</label>
                      <input 
                        type="email" 
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefone</label>
                      <input 
                        type="tel" 
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Mensagem</label>
                      <textarea 
                        id="message" 
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Descreva brevemente seu caso..."
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                    >
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Endereço</h3>
                      <p className="text-muted-foreground">
                        Rua Capitão Antonio Rosa, 409<br />
                        São Paulo - SP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Telefone</h3>
                      <p className="text-muted-foreground">
                        (11) 2133-2188<br />
                        (11) 9 4721-9180
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">E-mail</h3>
                      <p className="text-muted-foreground">
                        contato@jfg.adv.br<br />
                        jose.fabio.garcez@adv.oabsp.org.br
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 9h às 18h<br />
                        Sábado: 9h às 13h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Dados Corporativos</h3>
                      <p className="text-muted-foreground">
                        CNPJ: 63.795.411/0001-30<br />
                        OAB/SP: 504.270
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-24 w-24" />
              </div>
              <p className="text-sm text-muted-foreground">
                Excelência em advocacia com compromisso, ética e resultados.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#areas" className="hover:text-primary transition-colors">Áreas de Atuação</a></li>
                <li><a href="#equipe" className="hover:text-primary transition-colors">Equipe</a></li>
                <li><a href="#contato" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>(11) 2133-2188</li>
                <li>(11) 9 4721-9180</li>
                <li>contato@jfg.adv.br</li>
                <li>Rua Capitão Antonio Rosa, 409 - São Paulo/SP</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Escritório Jurídico. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

