import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users, Building2, FileText, Heart, TrendingUp } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import FormularioContato from "@/components/FormularioContato";
import MapaEscritorio from "@/components/MapaEscritorio";

export default function HomeInstitucional() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Header/Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-12" />
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#sobre" className="text-gray-700 hover:text-[#1a2847] transition-colors">Sobre</a>
            <a href="#areas" className="text-gray-700 hover:text-[#1a2847] transition-colors">Áreas de Atuação</a>
            <a href="#equipe" className="text-gray-700 hover:text-[#1a2847] transition-colors">Equipe</a>
            <a href="#contato" className="text-gray-700 hover:text-[#1a2847] transition-colors">Contato</a>
          </nav>
          <Button 
            onClick={() => window.location.href = '/procuracao'}
            className="bg-[#1a2847] hover:bg-[#2a3857]"
          >
            Agende uma Consulta
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/hero-office.jpg)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Excelência Jurídica com Compromisso e Resultados
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Mais de 20 anos de experiência em soluções jurídicas personalizadas
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/procuracao'}
            className="bg-white text-[#1a2847] hover:bg-gray-100 text-lg px-8 py-6"
          >
            Fale Conosco
          </Button>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1a2847] mb-6">Sobre Nós</h2>
              <p className="text-lg text-gray-700 mb-6">
                O escritório JFG Advocacia foi fundado com o propósito de oferecer serviços jurídicos 
                de excelência, pautados pela ética, compromisso e busca constante por resultados efetivos.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Com mais de 20 anos de atuação, construímos uma trajetória sólida baseada na confiança 
                de nossos clientes e na dedicação incansável à defesa de seus direitos e interesses.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1a2847]">20+</div>
                  <div className="text-sm text-gray-600">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1a2847]">500+</div>
                  <div className="text-sm text-gray-600">Casos de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1a2847]">98%</div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/images/about-office.jpg" 
                alt="Escritório JFG" 
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section id="areas" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a2847] mb-4">Áreas de Atuação</h2>
            <p className="text-lg text-gray-600">
              Oferecemos assessoria jurídica completa em diversas áreas do direito
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Scale, title: "Direito Civil", desc: "Contratos, responsabilidade civil e direitos reais" },
              { icon: Building2, title: "Direito Empresarial", desc: "Consultoria empresarial e societária" },
              { icon: Users, title: "Direito Trabalhista", desc: "Relações de trabalho e ações trabalhistas" },
              { icon: TrendingUp, title: "Direito Tributário", desc: "Planejamento tributário e contencioso fiscal" },
              { icon: Heart, title: "Direito de Família", desc: "Divórcio, guarda e pensão alimentícia" },
              { icon: FileText, title: "Direito Imobiliário", desc: "Compra, venda e regularização de imóveis" },
            ].map((area, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <area.icon className="w-12 h-12 text-[#1a2847] mb-4" />
                  <h3 className="text-xl font-bold text-[#1a2847] mb-2">{area.title}</h3>
                  <p className="text-gray-600">{area.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section id="equipe" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a2847] mb-4">Nossa Equipe</h2>
            <p className="text-lg text-gray-600">
              Profissionais experientes e comprometidos com seus resultados
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <img 
                  src="/images/dr-jose-fabio.jpg" 
                  alt="Dr. José Fábio Garcez" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-2xl font-bold text-[#1a2847] mb-2">Dr. José Fábio Garcez</h3>
                <p className="text-gray-600 mb-2">Sócio Fundador</p>
                <p className="text-sm text-gray-500 mb-4">OAB/SP 504.270</p>
                <p className="text-gray-700">
                  Advogado com mais de 20 anos de experiência, especialista em Direito Civil, 
                  Empresarial e Trabalhista. Pós-graduado em Direito Processual Civil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mapa do Escritório */}
      <MapaEscritorio />

      {/* Entre em Contato */}
      <FormularioContato />

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Logo e Descrição */}
            <div>
              <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-12 mb-4" />
              <p className="text-gray-600">
                Excelência em advocacia com compromisso, ética e resultados.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="font-bold text-[#1a2847] mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#sobre" className="text-gray-600 hover:text-[#1a2847]">Sobre</a></li>
                <li><a href="#areas" className="text-gray-600 hover:text-[#1a2847]">Áreas de Atuação</a></li>
                <li><a href="#equipe" className="text-gray-600 hover:text-[#1a2847]">Equipe</a></li>
                <li><a href="#contato" className="text-gray-600 hover:text-[#1a2847]">Contato</a></li>
                <li><a href="/admin/login" className="text-gray-600 hover:text-[#1a2847]">Painel Administrativo</a></li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-bold text-[#1a2847] mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-600">
                <li>(11) 2888-2133</li>
                <li>(11) 94721-9180</li>
                <li>contato@jfg.adv.br</li>
                <li>Rua Capitão Antonio Rosa, 409 - São Paulo/SP</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>© 2025 Escritório Jurídico. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Botão WhatsApp Flutuante */}
      <WhatsAppButton />
    </div>
  );
}

