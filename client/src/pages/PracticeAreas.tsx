import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Heart,
  Briefcase,
  FileText,
  Shield,
  Users,
  Home as HomeIcon,
  Building,
  Gavel,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function PracticeAreas() {
  const areas = [
    {
      icon: Heart,
      title: "Direito de Familia",
      description: "Atuacao completa em questoes familiares, sempre buscando solucoes que preservem os vinculos e os interesses de todos os envolvidos.",
      services: [
        "Divorcio consensual e litigioso",
        "Guarda de filhos e regulamentacao de visitas",
        "Pensao alimenticia",
        "Partilha de bens",
        "Uniao estavel",
        "Investigacao e negatoria de paternidade",
        "Adocao",
      ],
    },
    {
      icon: Briefcase,
      title: "Direito Trabalhista",
      description: "Defesa dos direitos trabalhistas com experiencia em acoes judiciais e negociacoes extrajudiciais.",
      services: [
        "Acoes trabalhistas",
        "Rescisoes contratuais",
        "Horas extras e adicional noturno",
        "FGTS e verbas rescitorias",
        "Assedio moral e discriminacao",
        "Acidente de trabalho",
        "Acordo e homologacao",
      ],
    },
    {
      icon: FileText,
      title: "Direito Civil",
      description: "Solucoes juridicas para questoes civeis diversas, com foco em prevencao de conflitos e resolucao eficiente de litigios.",
      services: [
        "Elaboracao e revisao de contratos",
        "Acoes de indenizacao",
        "Responsabilidade civil",
        "Acoes de cobranca",
        "Danos morais e materiais",
        "Direito das obrigacoes",
        "Direito das sucessoes",
      ],
    },
    {
      icon: Shield,
      title: "Direito do Consumidor",
      description: "Defesa dos direitos do consumidor contra praticas abusivas e irregularidades no mercado de consumo.",
      services: [
        "Acoes contra fornecedores",
        "Defeitos em produtos e servicos",
        "Cobranca indevida",
        "Negativacao irregular",
        "Propaganda enganosa",
        "Vicio e garantia",
        "Relacoes de consumo",
      ],
    },
    {
      icon: Users,
      title: "Direito Previdenciario",
      description: "Assessoria completa em questoes previdenciarias, garantindo o acesso aos beneficios devidos.",
      services: [
        "Aposentadorias (idade, tempo de contribuicao, invalidez)",
        "Revisao de beneficios",
        "Auxilio-doenca",
        "Pensao por morte",
        "BPC/LOAS",
        "Planejamento previdenciario",
        "Recursos administrativos",
      ],
    },
    {
      icon: HomeIcon,
      title: "Direito Imobiliario",
      description: "Atuacao em questoes relacionadas a imoveis, desde transacoes ate resolucao de conflitos.",
      services: [
        "Compra e venda de imoveis",
        "Contratos de locacao",
        "Despejo e cobranca de alugueis",
        "Usucapiao",
        "Regularizacao de imoveis",
        "Incorporacao imobiliaria",
        "Condominio",
      ],
    },
    {
      icon: Building,
      title: "Direito Empresarial",
      description: "Consultoria juridica para empresas, auxiliando na gestao de riscos e no crescimento sustentavel do negocio.",
      services: [
        "Constituicao de empresas",
        "Contratos empresariais",
        "Recuperacao judicial e falencia",
        "Direito societario",
        "Compliance",
        "Propriedade intelectual",
        "Consultoria preventiva",
      ],
    },
    {
      icon: Gavel,
      title: "Outras Areas",
      description: "Atuacao em diversas outras areas do direito, sempre com compromisso e dedicacao.",
      services: [
        "Direito bancario",
        "Direito tributario",
        "Direito administrativo",
        "Direito eleitoral",
        "Mediacao e arbitragem",
        "Consultoria juridica",
        "Pareceres juridicos",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Areas de Atuacao</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Experiencia e dedicacao em diversas areas do direito para atender suas necessidades juridicas
          </p>
        </div>
      </section>

      {/* Introducao */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            A JFG Advocacia atua em diversas areas do direito, oferecendo servicos juridicos 
            especializados e personalizados. Nossa experiencia e compromisso garantem solucoes 
            eficientes e estrategicas para cada caso, sempre com foco nos melhores resultados 
            para nossos clientes.
          </p>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {areas.map((area, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-amber-500">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <area.icon className="h-12 w-12 text-amber-500 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-2xl text-blue-900 mb-2">{area.title}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {area.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-blue-900 mb-3">Servicos:</h4>
                  <ul className="space-y-2">
                    {area.services.map((service, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Precisa de Assistencia em Alguma Dessas Areas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato conosco para agendar uma consulta e discutir seu caso. 
            Estamos prontos para ajudar voce a encontrar a melhor solucao juridica.
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
            <a href="https://wa.me/5511947219180" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold text-lg px-8">
                WhatsApp: (11) 94721-9180
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

