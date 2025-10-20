import { Card, CardContent } from "@/components/ui/card";
import { Scale, Award, Target, Heart, Users, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function About() {
  const values = [
    {
      icon: Scale,
      title: "Etica e Transparencia",
      description: "Atuamos com total transparencia e etica profissional em todos os casos, mantendo nossos clientes sempre informados sobre cada etapa do processo.",
    },
    {
      icon: Award,
      title: "Excelencia Juridica",
      description: "Buscamos constantemente a excelencia no atendimento e na prestacao de servicos juridicos, com estudo aprofundado de cada caso.",
    },
    {
      icon: Heart,
      title: "Atendimento Humanizado",
      description: "Acreditamos que cada cliente e unico e merece atencao personalizada, com empatia e compreensao de suas necessidades especificas.",
    },
    {
      icon: Target,
      title: "Foco em Resultados",
      description: "Nosso compromisso e alcançar os melhores resultados possiveis para nossos clientes, com estrategias juridicas eficientes e bem planejadas.",
    },
    {
      icon: Users,
      title: "Relacionamento Duradouro",
      description: "Valorizamos o relacionamento de longo prazo com nossos clientes, construindo confianca mutua e parceria solida.",
    },
    {
      icon: Lightbulb,
      title: "Inovacao e Tecnologia",
      description: "Utilizamos tecnologia e inovacao para otimizar processos e oferecer solucoes modernas e praticas aos nossos clientes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Scale className="h-16 w-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Sobre a JFG Advocacia</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Comprometidos com a excelencia juridica e o atendimento humanizado
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">Nossa Historia</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              A JFG Advocacia nasceu do compromisso de oferecer servicos juridicos de excelencia, 
              aliando experiencia profissional solida a um atendimento verdadeiramente humanizado. 
              Fundada pelo Dr. Jose Fabio Garcez, o escritorio se destaca pela dedicacao em 
              compreender as necessidades especificas de cada cliente e pela busca incansavel 
              pelos melhores resultados.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Com inscricao na OAB/SP sob o numero 504.270, o Dr. Jose Fabio Garcez construiu 
              sua carreira com base em valores solidos como etica, transparencia e compromisso 
              com a justica. Ao longo de sua trajetoria profissional, acumulou vasta experiencia 
              em diversas areas do direito, sempre priorizando o dialogo franco e a orientacao 
              clara aos seus clientes.
            </p>
            <p className="text-lg leading-relaxed">
              Hoje, a JFG Advocacia e reconhecida pela qualidade de seus servicos e pela 
              capacidade de encontrar solucoes juridicas eficientes e estrategicas. O escritorio 
              combina tradicao e modernidade, utilizando tecnologia para otimizar processos e 
              oferecer maior comodidade aos clientes, sem perder o toque pessoal que caracteriza 
              um atendimento de qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Advogado */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-12 text-white flex items-center justify-center">
              <div className="text-center">
                <Scale className="h-32 w-32 text-amber-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-2">Dr. Jose Fabio Garcez</h3>
                <p className="text-xl text-blue-200">OAB/SP 504.270</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Advogado Responsavel</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  O Dr. Jose Fabio Garcez e advogado inscrito na Ordem dos Advogados do Brasil, 
                  Seccao de Sao Paulo, sob o numero 504.270. Com formacao juridica solida e 
                  atualizacao constante, dedica-se a oferecer servicos juridicos de alta qualidade 
                  em diversas areas do direito.
                </p>
                <p className="text-lg leading-relaxed">
                  Sua atuacao e pautada pela etica profissional, compromisso com os interesses 
                  dos clientes e busca incessante por solucoes juridicas eficazes. Acredita que 
                  o sucesso de um caso depende nao apenas do conhecimento tecnico, mas tambem 
                  da capacidade de compreender as necessidades e expectativas de cada cliente.
                </p>
                <p className="text-lg leading-relaxed">
                  Ao longo de sua carreira, o Dr. Jose Fabio desenvolveu expertise em areas 
                  como Direito de Familia, Direito Trabalhista, Direito Civil, Direito do 
                  Consumidor e Direito Previdenciario, sempre com foco em resultados concretos 
                  e satisfacao do cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missao e Valores */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Missao e Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossos valores guiam cada decisao e acao, garantindo um servico juridico 
              de excelencia e confianca.
            </p>
          </div>

          {/* Missao */}
          <div className="mb-16">
            <Card className="border-t-4 border-t-amber-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">Nossa Missao</h3>
                <p className="text-lg text-gray-700 text-center leading-relaxed">
                  Oferecer servicos juridicos de excelencia, com etica, transparencia e 
                  compromisso, buscando sempre as melhores solucoes para nossos clientes e 
                  contribuindo para a construcao de uma sociedade mais justa e equilibrada.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Localizacao */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">Onde Estamos</h2>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Endereco</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Rua Capitao Antonio Rosa, n 409, 1 Andar<br />
                  Edificio Spaces<br />
                  Jardim Paulistano<br />
                  Sao Paulo/SP - CEP 01443-010
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Estamos localizados em uma regiao privilegiada de Sao Paulo, com facil 
                  acesso e infraestrutura completa para melhor atende-lo.
                </p>
                <p className="text-sm text-gray-500">
                  Atendimento mediante agendamento previo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

