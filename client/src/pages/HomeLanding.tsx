import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  HeartHandshake,
  Home,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Phone,
  Scale,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PublicInfo = {
  selic: string | null;
  selicDate: string | null;
  holidayName: string | null;
  holidayDate: string | null;
  loading: boolean;
};

const practiceAreas = [
  {
    icon: UsersRound,
    title: "Direito Civil",
    description: "Contratos, indenizações, responsabilidade civil e questões patrimoniais.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Direito Empresarial",
    description: "Estruturação societária, contratos comerciais e consultoria para empresas.",
  },
  {
    icon: FileText,
    title: "Direito Trabalhista",
    description: "Atuação consultiva, defesa em ações trabalhistas e prevenção de passivos.",
  },
  {
    icon: Landmark,
    title: "Direito Tributário",
    description: "Planejamento tributário, recuperação de créditos e defesas fiscais.",
  },
  {
    icon: HeartHandshake,
    title: "Direito de Família",
    description: "Divórcio, guarda, pensão alimentícia, inventários e sucessões.",
  },
  {
    icon: Home,
    title: "Direito Imobiliário",
    description: "Compra e venda, locação, regularização de imóveis e usucapião.",
  },
];

const formatApiDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatBcbDate = (value: string) => {
  const [day, month, year] = value.split("/").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

export default function HomeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [publicInfo, setPublicInfo] = useState<PublicInfo>({
    selic: null,
    selicDate: null,
    holidayName: null,
    holidayDate: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadPublicInfo() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selicRequest = fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json",
        { signal: controller.signal },
      ).then((response) => {
        if (!response.ok) throw new Error("Não foi possível consultar a SELIC");
        return response.json() as Promise<Array<{ data: string; valor: string }>>;
      });

      const getHolidays = async (year: number) => {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Não foi possível consultar os feriados");
        return response.json() as Promise<
          Array<{ date: string; name: string; type: string }>
        >;
      };

      try {
        const [selicResult, holidaysResult] = await Promise.allSettled([
          selicRequest,
          getHolidays(today.getFullYear()),
        ]);

        let holiday: { date: string; name: string } | undefined;
        if (holidaysResult.status === "fulfilled") {
          holiday = holidaysResult.value.find((item) => {
            const [year, month, day] = item.date.split("-").map(Number);
            return new Date(year, month - 1, day) >= today;
          });
        }

        if (!holiday) {
          try {
            const nextYearHolidays = await getHolidays(today.getFullYear() + 1);
            holiday = nextYearHolidays[0];
          } catch {
            // A interface mantém uma mensagem de indisponibilidade sem bloquear o restante da página.
          }
        }

        setPublicInfo({
          selic:
            selicResult.status === "fulfilled" ? selicResult.value[0]?.valor ?? null : null,
          selicDate:
            selicResult.status === "fulfilled" ? selicResult.value[0]?.data ?? null : null,
          holidayName: holiday?.name ?? null,
          holidayDate: holiday?.date ?? null,
          loading: false,
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setPublicInfo((current) => ({ ...current, loading: false }));
        }
      }
    }

    void loadPublicInfo();
    return () => controller.abort();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = [
      "Olá! Gostaria de solicitar um contato da JFG Advocacia.",
      `Nome: ${formData.name}`,
      `E-mail: ${formData.email}`,
      `Telefone: ${formData.phone}`,
      `Mensagem: ${formData.message}`,
    ].join("\n");

    window.open(`https://wa.me/5511947219180?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    toast.success("Abrimos o WhatsApp com sua mensagem preenchida.");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.id]: event.target.value }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07101e]/90 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <nav className="container flex h-[76px] items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3" aria-label="JFG Advocacia — início">
            <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-14 w-14 object-contain" />
            <div className="hidden border-l border-white/20 pl-3 sm:block">
              <p className="font-display text-base leading-none tracking-wide">JFG Advocacia</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/55">Consultoria Jurídica</p>
            </div>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            <a href="#sobre" className="nav-link">Sobre</a>
            <a href="#areas" className="nav-link">Áreas de Atuação</a>
            <a href="#informacoes" className="nav-link">Informações</a>
            <a href="#contato" className="nav-link">Contato</a>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden rounded-none bg-[#b4935d] px-5 text-[#07101e] shadow-none hover:bg-[#ccb07d] sm:inline-flex">
              <a href="#contato">Agende uma consulta</a>
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white lg:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-white/10 bg-[#07101e] lg:hidden">
            <div className="container grid py-4">
              {[
                ["Sobre", "#sobre"],
                ["Áreas de Atuação", "#areas"],
                ["Informações", "#informacoes"],
                ["Contato", "#contato"],
              ].map(([label, href]) => (
                <a key={href} href={href} onClick={closeMenu} className="border-b border-white/10 py-3 text-sm text-white/80 last:border-0">
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="inicio" className="relative flex min-h-[690px] items-center overflow-hidden pt-[76px]">
          <div className="absolute inset-0">
            <img
              src="/images/hero-image.jpeg"
              alt="Escritório contemporâneo com salas envidraçadas"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,28,0.98)_0%,rgba(5,14,28,0.91)_43%,rgba(5,14,28,0.30)_100%)]" />
            <div className="navy-grid absolute inset-0 opacity-35" />
            <div className="absolute inset-y-0 left-[58%] hidden w-px bg-gradient-to-b from-transparent via-[#b4935d]/55 to-transparent lg:block" />
          </div>

          <div className="container relative z-10 py-24 lg:py-32">
            <div className="max-w-[720px]">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#d2b77f]">
                <span className="h-px w-10 bg-[#b4935d]" />
                Assessoria jurídica em São Paulo
              </div>
              <h1 className="font-display text-[3.1rem] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5.25rem]">
                JFG
                <span className="mt-3 block text-[0.56em] leading-[1.08] tracking-[-0.025em] text-white/92">
                  Advocacia &amp;<br className="hidden sm:block" /> Consultoria Jurídica
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                Clareza, estratégia e proximidade para proteger interesses, prevenir conflitos e apoiar decisões importantes.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="group rounded-none bg-[#b4935d] px-7 text-[#07101e] hover:bg-[#ccb07d]">
                  <a href="#contato">
                    Fale conosco
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-none border-white/35 bg-transparent px-7 text-white hover:bg-white hover:text-[#07101e]">
                  <a href="#areas">Conheça nossa atuação</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-white/12 bg-[#07101e]/76 backdrop-blur-md md:block">
            <div className="container grid grid-cols-3 divide-x divide-white/12 py-5">
              {["Atendimento personalizado", "Estratégia preventiva", "Comunicação transparente"].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 px-5 text-xs uppercase tracking-[0.14em] text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#b4935d]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="paper-texture relative py-24 lg:py-32">
          <div className="container">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div className="order-2 lg:order-1">
                <p className="section-kicker">Sobre o escritório</p>
                <h2 className="section-title mt-4">Experiência jurídica com escuta atenta e visão estratégica.</h2>
                <div className="mt-7 space-y-5 text-[1.02rem] leading-8 text-muted-foreground">
                  <p>
                    Com mais de 20 anos de experiência, o escritório atua com foco em soluções jurídicas claras, responsáveis e personalizadas para cada contexto.
                  </p>
                  <p>
                    A condução de cada demanda combina análise técnica, proximidade no atendimento e comunicação transparente em todas as etapas.
                  </p>
                </div>
                <div className="mt-9 grid gap-3 sm:grid-cols-3">
                  {[
                    ["01", "Escuta e diagnóstico"],
                    ["02", "Estratégia sob medida"],
                    ["03", "Acompanhamento próximo"],
                  ].map(([number, label]) => (
                    <div key={number} className="border-l border-[#b4935d]/60 pl-4">
                      <span className="text-[11px] font-semibold tracking-[0.18em] text-[#927447]">{number}</span>
                      <p className="mt-1 text-sm font-medium leading-5 text-[#152238]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -bottom-5 -left-5 h-full w-full border border-[#b4935d]/45" />
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#d8d3ca] shadow-[0_28px_70px_rgba(7,16,30,0.20)]">
                    <img
                      src="/images/about-image.jpg"
                      alt="Ambiente interno do escritório"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07101e]/28 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="areas" className="subtle-grid bg-[#f5f3ef] py-24 lg:py-32">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="section-kicker">Áreas de atuação</p>
                <h2 className="section-title mt-4">Atuação ampla, orientação precisa.</h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
                Assessoria consultiva e contenciosa para pessoas e empresas, com uma abordagem integrada para desafios jurídicos de diferentes naturezas.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden border border-[#d9d4ca] bg-[#d9d4ca] md:grid-cols-2 lg:grid-cols-3">
              {practiceAreas.map((area, index) => (
                <article key={area.title} className="group relative min-h-[260px] bg-[#fbfaf7] p-7 transition-colors duration-300 hover:bg-white lg:p-8">
                  <span className="absolute right-6 top-5 font-display text-4xl text-[#0a1a30]/[0.06]">0{index + 1}</span>
                  <div className="flex h-11 w-11 items-center justify-center border border-[#b4935d]/45 bg-[#b4935d]/[0.07] text-[#8d7045] transition-colors group-hover:bg-[#0a1a30] group-hover:text-[#d5b97f]">
                    <area.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-7 font-display text-2xl text-[#0a1a30]">{area.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{area.description}</p>
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#b4935d] transition-all duration-300 group-hover:w-full" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="informacoes" className="relative overflow-hidden bg-[#07101e] py-24 text-white lg:py-28">
          <div className="navy-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-36 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#b4935d]/10 blur-3xl" />
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="section-kicker text-[#d2b77f]">Dados de interesse público</p>
                <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">
                  Informação confiável também faz parte de uma boa decisão.
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-white/65">
                  Indicadores consultados diretamente em fontes públicas e apresentados de forma objetiva. Os dados são informativos e não substituem análise jurídica específica.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2" aria-live="polite">
                <Card className="rounded-none border-white/12 bg-white/[0.055] text-white shadow-none backdrop-blur-sm">
                  <CardContent className="p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center border border-[#b4935d]/45 text-[#d2b77f]">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Banco Central</span>
                    </div>
                    <p className="mt-8 text-sm text-white/55">Meta da Taxa SELIC</p>
                    <p className="mt-1 font-display text-5xl text-white">
                      {publicInfo.loading ? "—" : publicInfo.selic ? `${Number(publicInfo.selic).toLocaleString("pt-BR")}%` : "Indisponível"}
                    </p>
                    <p className="mt-3 min-h-5 text-xs text-white/45">
                      {publicInfo.selicDate ? `Atualização de ${formatBcbDate(publicInfo.selicDate)}` : "Consulta automática à série SGS 432"}
                    </p>
                    <a
                      href="https://www.bcb.gov.br/controleinflacao/taxaselic"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d2b77f] hover:text-white"
                    >
                      Fonte oficial <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-white/12 bg-white/[0.055] text-white shadow-none backdrop-blur-sm">
                  <CardContent className="p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center border border-[#b4935d]/45 text-[#d2b77f]">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Calendário nacional</span>
                    </div>
                    <p className="mt-8 text-sm text-white/55">Próximo feriado nacional</p>
                    <p className="mt-2 font-display text-3xl leading-tight text-white">
                      {publicInfo.loading ? "Consultando…" : publicInfo.holidayName ?? "Indisponível"}
                    </p>
                    <p className="mt-3 min-h-5 text-xs text-white/45">
                      {publicInfo.holidayDate ? formatApiDate(publicInfo.holidayDate) : "Calendário público da BrasilAPI"}
                    </p>
                    <a
                      href="https://brasilapi.com.br/docs#tag/Feriados-Nacionais"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d2b77f] hover:text-white"
                    >
                      Consultar fonte <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>
                <p className="sm:col-span-2 text-xs leading-5 text-white/40">
                  Feriados e suspensões de prazos podem variar conforme o tribunal e a localidade. Consulte sempre o calendário oficial aplicável ao caso.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="paper-texture py-24 lg:py-32">
          <div className="container">
            <div className="mb-12 max-w-2xl">
              <p className="section-kicker">Contato</p>
              <h2 className="section-title mt-4">Converse com o escritório.</h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                Conte brevemente sua necessidade. A mensagem será preparada para envio pelo WhatsApp do escritório.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
              <Card className="rounded-none border-[#d9d4ca] bg-white/85 shadow-[0_24px_70px_rgba(20,31,48,0.09)] backdrop-blur-sm">
                <CardContent className="p-6 sm:p-9">
                  <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="form-label">Nome completo</label>
                      <input id="name" value={formData.name} onChange={handleChange} className="form-field" placeholder="Seu nome" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="form-label">Telefone</label>
                      <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="form-field" placeholder="(11) 99999-9999" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="form-label">E-mail</label>
                      <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-field" placeholder="seu@email.com" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="form-label">Como podemos ajudar?</label>
                      <textarea id="message" rows={5} value={formData.message} onChange={handleChange} className="form-field resize-none" placeholder="Descreva brevemente sua necessidade..." required />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" size="lg" className="group w-full rounded-none bg-[#0a1a30] text-white hover:bg-[#132b4c] sm:w-auto">
                        Enviar pelo WhatsApp
                        <MessageSquareText className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="border border-[#d9d4ca] bg-[#0a1a30] p-7 text-white shadow-[0_24px_70px_rgba(20,31,48,0.14)] sm:p-9">
                <div className="mb-8 flex items-center gap-3 border-b border-white/12 pb-6">
                  <Scale className="h-7 w-7 text-[#d2b77f]" />
                  <div>
                    <p className="font-display text-xl">JFG Advocacia</p>
                    <p className="text-xs tracking-wide text-white/45">OAB/SP 504.270</p>
                  </div>
                </div>
                <div className="space-y-7">
                  {[
                    { icon: MapPin, title: "Endereço", content: <>Rua Capitão Antonio Rosa, 409<br />São Paulo — SP</> },
                    { icon: Phone, title: "Telefones", content: <><a href="tel:+551121332188" className="hover:text-[#d2b77f]">(11) 2133-2188</a><br /><a href="tel:+5511947219180" className="hover:text-[#d2b77f]">(11) 9 4721-9180</a></> },
                    { icon: Mail, title: "E-mail", content: <><a href="mailto:contato@jfg.adv.br" className="hover:text-[#d2b77f]">contato@jfg.adv.br</a><br /><a href="mailto:jose.fabio.garcez@adv.oabsp.org.br" className="break-all hover:text-[#d2b77f]">jose.fabio.garcez@adv.oabsp.org.br</a></> },
                    { icon: Clock, title: "Atendimento", content: <>Segunda a sexta, das 9h às 18h<br />Sábado, das 9h às 13h</> },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#d2b77f]" />
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{item.title}</h3>
                        <div className="mt-1 text-sm leading-6 text-white/78">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050d19] py-12 text-white">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
            <div>
              <img src="/images/logo-jfg.png" alt="JFG Advocacia" className="h-20 w-20 object-contain" />
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/48">
                Atendimento jurídico responsável, estratégico e próximo para pessoas e empresas.
              </p>
            </div>
            <div>
              <h3 className="footer-heading">Links rápidos</h3>
              <ul className="mt-5 space-y-3 text-sm text-white/55">
                <li><a href="#sobre" className="hover:text-[#d2b77f]">Sobre</a></li>
                <li><a href="#areas" className="hover:text-[#d2b77f]">Áreas de Atuação</a></li>
                <li><a href="#informacoes" className="hover:text-[#d2b77f]">Informações</a></li>
                <li><a href="#contato" className="hover:text-[#d2b77f]">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-heading">Dados do escritório</h3>
              <div className="mt-5 space-y-2 text-sm leading-6 text-white/55">
                <p>CNPJ: 63.795.411/0001-30</p>
                <p>OAB/SP: 504.270</p>
                <p>Rua Capitão Antonio Rosa, 409 — São Paulo/SP</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} JFG Advocacia. Todos os direitos reservados.</p>
            <p>Conteúdo de caráter exclusivamente informativo.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
