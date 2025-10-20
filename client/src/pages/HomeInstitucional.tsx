import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Scale, 
  Users, 
  Briefcase, 
  Heart, 
  Home as HomeIcon, 
  Shield, 
  FileText,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomeInstitucional() {
  const practiceAreas = [
    {
      icon: Heart,
      title: "Direito de Familia",
      description: "Divorcio, guarda de filhos, pensao alimenticia e partilha de bens.",
    },
    {
      icon: Briefcase,
      title: "Direito Trabalhista",
      description: "Acoes trabalhistas, rescisoes contratuais e direitos do trabalhador.",
    },
    {
      icon: FileText,
      title: "Direito Civil",
      description: "Contratos, indenizacoes, responsabilidade civil e acoes de cobranca.",
    },
    {
      icon: Shield,
      title: "Direito do Consumidor",
      description: "Defesa de direitos do consumidor e acoes contra fornecedores.",
    },
    {
      icon: Users,
      title: "Direito Previdenciario",
      description: "Aposentadorias, beneficios e revisoes previdenciarias.",
    },
    {
      icon: HomeIcon,
      title: "Direito Imobiliario",
      description: "Compra e venda, locacao, usucapiao e regularizacao de imoveis.",
    },
  ];

  const benefits = [
    "Atendimento personalizado e humanizado",
    "Experiencia solida em diversas areas do direito",
    "Solucoes juridicas eficientes e estrategicas",
    "Transparencia e comunicacao clara com o cliente",
    "Tecnologia aplicada ao servico juridico",
    "Compromisso com resultados e satisfacao do cliente",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-12 w-12 text-amber-400" />
                <span className="text-amber-400 font-semibold text-lg">OAB/SP 504.270</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Solucoes Juridicas com Excelencia
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Escritorio especializado em diversas areas do direito, oferecendo 
                atendimento personalizado e comprometido com os melhores resultados 
                para nossos clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contato">
                  <a>
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold text-lg px-8">
                      Agendar Consulta
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </Link>
                <Link href="/procuracao">
                  <a>
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold text-lg px-8">
                      Procuracao Digital
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-20"></div>
                <Scale className="h-64 w-64 text-amber-400 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas de Atuacao */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Areas de Atuacao</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Atuamos em diversas areas do direito, sempre com foco em solucoes 
              eficientes e personalizadas para cada caso.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-amber-500">
                <CardHeader>
                  <area.icon className="h-12 w-12 text-amber-500 mb-3" />
                  <CardTitle className="text-xl text-blue-900">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {area.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/areas-atuacao">
              <a>
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
                  Ver Todas as Areas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                Por que escolher a JFG Advocacia?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Nosso compromisso e oferecer um servico juridico de excelencia, 
                aliando experiencia profissional, atendimento humanizado e 
                tecnologia para garantir os melhores resultados.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Procuracao Digital</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Inove com nosso sistema de procuracao digital! Preencha o formulario 
                online, assine digitalmente e receba seu documento em minutos, com 
                total seguranca e praticidade.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  <span>Processo 100% online</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  <span>Assinatura digital segura</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  <span>Documento gerado em PDF</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  <span>Envio automatico via WhatsApp</span>
                </li>
              </ul>
              <Link href="/procuracao">
                <a>
                  <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold">
                    Acessar Procuracao Digital
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Precisa de Assistencia Juridica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco e agende uma consulta. Estamos prontos para 
            ajudar voce a encontrar a melhor solucao para seu caso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contato">
              <a>
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold text-lg px-8">
                  Entrar em Contato
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <a href="tel:+5511947219180">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold text-lg px-8">
                Ligar: (11) 94721-9180
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

