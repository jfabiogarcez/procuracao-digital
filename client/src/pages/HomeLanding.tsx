import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Scale, 
  Briefcase, 
  Users, 
  Home as HomeIcon,
  Building,
  Heart,
  FileText,
  Phone,
  MapPin,
  Clock
} from "lucide-react";

export default function HomeLanding() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const practiceAreas = [
    {
      icon: FileText,
      title: "Direito Civil",
      description: "Contratos, indenizacoes, responsabilidade civil e questoes patrimoniais.",
    },
    {
      icon: Building,
      title: "Direito Empresarial",
      description: "Constituicao de empresas, contratos comerciais e consultoria corporativa.",
    },
    {
      icon: Briefcase,
      title: "Direito Trabalhista",
      description: "Defesa em acoes trabalhistas, acordos e consultoria preventiva.",
    },
    {
      icon: Scale,
      title: "Direito Tributario",
      description: "Planejamento tributario, recuperacao de creditos e defesas fiscais.",
    },
    {
      icon: Heart,
      title: "Direito de Familia",
      description: "Divorcio, guarda, pensao alimenticia e inventarios.",
    },
    {
      icon: HomeIcon,
      title: "Direito Imobiliario",
      description: "Compra e venda, locacao, regularizacao e usucapiao.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero Section */}
      <header className="relative min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <img 
              src="/images/logo-jfg.png" 
              alt="JFG Advocacia" 
              className="h-16 w-auto"
            />
            <Button 
              onClick={() => scrollToSection('contato')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6"
            >
              Agende uma Consulta
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero-image.jpg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center min-h-screen pt-24">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                JFG<br />
                <span className="text-amber-400">Advocacia & Consultoria Juridica</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-100">
                Solucoes juridicas personalizadas com compromisso, etica e resultados. 
                Defendemos seus direitos com dedicacao e profissionalismo.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sobre Nos Section */}
      <section id="sobre" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                Sobre Nos
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Com mais de 20 anos de experiencia, nosso escritorio se consolidou como 
                  referencia em assessoria juridica de excelencia. Atuamos com foco em 
                  resultados, oferecendo solucoes estrategicas e personalizadas para cada cliente.
                </p>
                <p>
                  Nossa equipe e formada por advogados especializados e comprometidos com a 
                  defesa dos interesses de nossos clientes, sempre pautados pela etica, 
                  transparencia e profissionalismo.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/images/about-image.jpg" 
                alt="Sobre o escritorio" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Areas de Atuacao Section */}
      <section id="areas" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Areas de Atuacao
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos assessoria juridica completa em diversas areas do direito, 
              sempre com excelencia e dedicacao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-amber-500"
              >
                <CardHeader>
                  <area.icon className="h-12 w-12 text-amber-500 mb-3" />
                  <CardTitle className="text-xl text-blue-900">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {area.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe Section */}
      <section id="equipe" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais altamente qualificados e comprometidos com a excelencia 
              no atendimento e na defesa dos seus interesses.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src="/images/foto-jfg.jpg" 
                    alt="Dr. Jose Fabio Garcez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-8">
                  <h3 className="text-3xl font-bold text-blue-900 mb-2">
                    Dr. Jose Fabio Garcez
                  </h3>
                  <p className="text-lg text-amber-600 font-semibold mb-4">
                    Socio Fundador
                  </p>
                  <div className="space-y-3 text-gray-700">
                    <p className="text-base">
                      Direito do Trabalho e Direito Empresarial
                    </p>
                    <p className="text-lg font-semibold text-blue-900">
                      OAB/SP 504.270
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 px-4 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-blue-100">
              Estamos prontos para atende-lo. Agende uma consulta e conheca nossas solucoes juridicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Endereco</h3>
                <p className="text-blue-100">
                  Rua Capitao Antonio Rosa, 409<br />
                  Sao Paulo - SP
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Telefone</h3>
                <p className="text-blue-100">
                  (11) 2133-2188<br />
                  (11) 9 4721-9180
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Horario de Atendimento</h3>
                <p className="text-blue-100">
                  Segunda a Sexta: 9h as 18h<br />
                  Sabado: 9h as 13h
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <a href="https://wa.me/5511947219180" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-8">
                Chamar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">
            © {new Date().getFullYear()} JFG Advocacia. Todos os direitos reservados.
          </p>
          <p className="text-blue-300 mt-2">
            Dr. Jose Fabio Garcez - OAB/SP 504.270
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511947219180"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Contato via WhatsApp"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}

