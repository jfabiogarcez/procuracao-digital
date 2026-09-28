import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";
import "@/hybrid.css";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  HeartHandshake,
  Home,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Phone,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  languageOptions,
  translateHoliday,
  translations,
  type Language,
} from "@/lib/jfg-i18n";

type PublicInfo = {
  selic: string | null;
  selicDate: string | null;
  holidayName: string | null;
  holidayDate: string | null;
  loading: boolean;
};

const officeMapUrl =
  "https://www.google.com/maps/search/?api=1&query=R.%20Cap.%20Ant%C3%B4nio%20Rosa%2C%20409%20-%20Pinheiros%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001443-010";

const practiceIcons = [
  UsersRound,
  BriefcaseBusiness,
  FileText,
  Landmark,
  HeartHandshake,
  Home,
];

const hybridCopy = {
  pt: {
    perspectivesNav: "Perspectivas",
    heroTitle: "Clareza para o seu próximo passo.",
    heroDescription:
      "Assessoria jurídica com escuta atenta, análise técnica e estratégia para pessoas e empresas.",
    heroRail: ["Direito", "Contexto", "Decisões"],
    presence: "Presença",
    aboutLead: "Escuta. Contexto.",
    aboutAccent: "Próximos passos.",
    aboutCta: "Conheça nossa abordagem",
    aboutKeywords: ["Direito", "Negócios", "Pessoas", "Sociedade"],
    practicePrompt:
      "Apresente seu contexto e os documentos disponíveis para uma conversa inicial com o escritório.",
    practiceCta: "Conversar sobre esta área",
    practicePrefix: "Gostaria de conversar sobre",
    approachKicker: "Como conduzimos",
    approachTitle: "Uma conversa começa com o seu contexto.",
    approachIntro:
      "Documentos, dúvidas e objetivos ajudam a compreender a situação e organizar os próximos passos com responsabilidade.",
    approachCta: "Conversar sobre o tema",
    approachSteps: [
      ["Apresentar", "Conte sua questão e reúna as informações disponíveis."],
      ["Entender", "Converse sobre o contexto e esclareça as dúvidas iniciais."],
      ["Organizar", "Confirme quais informações e providências serão necessárias."],
      ["Acompanhar", "Combine como receber atualizações sobre o atendimento."],
    ],
    perspectivesKicker: "Conhecimento em movimento",
    perspectivesTitle: "Perspectivas",
    perspectivesTags: ["Ideias", "Análises", "Tendências"],
    perspectives: [
      [
        "Orientação inicial",
        "Como preparar uma conversa com o escritório",
        "Organize as dúvidas e os documentos relacionados ao assunto para tornar o primeiro contato mais objetivo.",
      ],
      [
        "Organização",
        "Documentos que ajudam a contar a sua história",
        "Contratos, mensagens e comprovantes podem ajudar a apresentar o contexto com mais clareza.",
      ],
      [
        "Atendimento",
        "O que esperar do primeiro atendimento",
        "A primeira conversa serve para compreender o contexto e identificar quais informações ainda faltam.",
      ],
    ],
    perspectivesDisclaimer:
      "Conteúdo geral e informativo. Não constitui orientação jurídica para uma situação concreta.",
    contactKicker: "Vamos conversar?",
    contactTitle: "Questões complexas pedem conversas claras.",
    prepareContact: "Preparar meu contato",
    contactHeading: "Contato",
  },
  en: {
    perspectivesNav: "Perspectives",
    heroTitle: "Clarity for your next step.",
    heroDescription:
      "Legal counsel grounded in attentive listening, technical analysis and strategy for individuals and businesses.",
    heroRail: ["Law", "Context", "Decisions"],
    presence: "Presence",
    aboutLead: "Listening. Context.",
    aboutAccent: "Next steps.",
    aboutCta: "Explore our approach",
    aboutKeywords: ["Law", "Business", "People", "Society"],
    practicePrompt:
      "Share your context and available documents for an initial conversation with the firm.",
    practiceCta: "Discuss this area",
    practicePrefix: "I would like to discuss",
    approachKicker: "How we work",
    approachTitle: "A conversation begins with your context.",
    approachIntro:
      "Documents, questions and objectives help us understand the matter and organize responsible next steps.",
    approachCta: "Discuss your matter",
    approachSteps: [
      ["Present", "Describe your matter and gather the information available."],
      ["Understand", "Discuss the context and clarify the initial questions."],
      ["Organize", "Confirm which information and actions will be required."],
      ["Follow up", "Agree on how to receive updates about the matter."],
    ],
    perspectivesKicker: "Knowledge in motion",
    perspectivesTitle: "Perspectives",
    perspectivesTags: ["Ideas", "Analysis", "Trends"],
    perspectives: [
      [
        "Initial guidance",
        "How to prepare for a conversation with the firm",
        "Organize your questions and related documents to make the first contact more objective.",
      ],
      [
        "Organization",
        "Documents that help tell your story",
        "Agreements, messages and receipts may help present the context more clearly.",
      ],
      [
        "Client service",
        "What to expect from the first consultation",
        "The first conversation helps us understand the context and identify missing information.",
      ],
    ],
    perspectivesDisclaimer:
      "General information only. This content does not constitute legal advice for a specific matter.",
    contactKicker: "Shall we talk?",
    contactTitle: "Complex matters call for clear conversations.",
    prepareContact: "Prepare my contact",
    contactHeading: "Contact",
  },
  es: {
    perspectivesNav: "Perspectivas",
    heroTitle: "Claridad para su próximo paso.",
    heroDescription:
      "Asesoría jurídica basada en escucha atenta, análisis técnico y estrategia para personas y empresas.",
    heroRail: ["Derecho", "Contexto", "Decisiones"],
    presence: "Presencia",
    aboutLead: "Escucha. Contexto.",
    aboutAccent: "Próximos pasos.",
    aboutCta: "Conozca nuestro enfoque",
    aboutKeywords: ["Derecho", "Negocios", "Personas", "Sociedad"],
    practicePrompt:
      "Presente su contexto y los documentos disponibles para una conversación inicial con el despacho.",
    practiceCta: "Conversar sobre esta área",
    practicePrefix: "Me gustaría conversar sobre",
    approachKicker: "Cómo trabajamos",
    approachTitle: "Una conversación comienza con su contexto.",
    approachIntro:
      "Documentos, dudas y objetivos ayudan a comprender la situación y organizar los próximos pasos con responsabilidad.",
    approachCta: "Conversar sobre el tema",
    approachSteps: [
      ["Presentar", "Cuente su situación y reúna la información disponible."],
      ["Comprender", "Converse sobre el contexto y aclare las dudas iniciales."],
      ["Organizar", "Confirme qué información y acciones serán necesarias."],
      ["Acompañar", "Acuerde cómo recibirá novedades sobre la atención."],
    ],
    perspectivesKicker: "Conocimiento en movimiento",
    perspectivesTitle: "Perspectivas",
    perspectivesTags: ["Ideas", "Análisis", "Tendencias"],
    perspectives: [
      [
        "Orientación inicial",
        "Cómo preparar una conversación con el despacho",
        "Organice sus dudas y documentos para que el primer contacto sea más objetivo.",
      ],
      [
        "Organización",
        "Documentos que ayudan a contar su historia",
        "Contratos, mensajes y comprobantes pueden ayudar a presentar el contexto con claridad.",
      ],
      [
        "Atención",
        "Qué esperar de la primera consulta",
        "La primera conversación permite comprender el contexto e identificar información pendiente.",
      ],
    ],
    perspectivesDisclaimer:
      "Contenido general e informativo. No constituye asesoría jurídica para una situación concreta.",
    contactKicker: "¿Hablamos?",
    contactTitle: "Los asuntos complejos requieren conversaciones claras.",
    prepareContact: "Preparar mi contacto",
    contactHeading: "Contacto",
  },
} as const;

function LanguageSelector({
  language,
  onChange,
  label,
}: {
  language: Language;
  onChange: (language: Language) => void;
  label: string;
}) {
  return (
    <div className="language-selector" role="group" aria-label={label}>
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => onChange(option.code)}
          className="language-option"
          data-active={language === option.code}
          aria-pressed={language === option.code}
          aria-label={option.label}
          title={option.label}
        >
          <span role="img" aria-hidden="true">{option.flag}</span>
          <span className="hidden 2xl:inline">{option.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export default function HomeHybrid() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "pt";
    const saved = window.localStorage.getItem("jfg-language");
    return saved === "en" || saved === "es" || saved === "pt" ? saved : "pt";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [publicInfo, setPublicInfo] = useState<PublicInfo>({
    selic: null,
    selicDate: null,
    holidayName: null,
    holidayDate: null,
    loading: true,
  });

  const t = translations[language];
  const h = hybridCopy[language];

  useEffect(() => {
    window.localStorage.setItem("jfg-language", language);
    document.documentElement.lang = t.locale;
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.pageDescription);
  }, [language, t.locale, t.pageDescription, t.pageTitle]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPublicInfo() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selicRequest = fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json",
        { signal: controller.signal },
      ).then((response) => {
        if (!response.ok) throw new Error("SELIC request failed");
        return response.json() as Promise<Array<{ data: string; valor: string }>>;
      });
      const getHolidays = async (year: number) => {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Holiday request failed");
        return response.json() as Promise<Array<{ date: string; name: string }>>;
      };
      try {
        const [selicResult, holidaysResult] = await Promise.allSettled([
          selicRequest,
          getHolidays(today.getFullYear()),
        ]);
        let holiday = holidaysResult.status === "fulfilled"
          ? holidaysResult.value.find((item) => {
              const [year, month, day] = item.date.split("-").map(Number);
              return new Date(year, month - 1, day) >= today;
            })
          : undefined;
        if (!holiday) {
          try {
            holiday = (await getHolidays(today.getFullYear() + 1))[0];
          } catch {
            // Public data is supplementary; keep the page available.
          }
        }
        setPublicInfo({
          selic: selicResult.status === "fulfilled" ? selicResult.value[0]?.valor ?? null : null,
          selicDate: selicResult.status === "fulfilled" ? selicResult.value[0]?.data ?? null : null,
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

  const formatApiDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(t.locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  const formatBcbDate = (value: string) => {
    const [day, month, year] = value.split("/").map(Number);
    return new Intl.DateTimeFormat(t.locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setIsMenuOpen(false);
  };

  const prepareAreaContact = (area: string) => {
    setFormData((current) => ({ ...current, message: `${h.practicePrefix} ${area}.` }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.id]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = [
      t.contact.whatsappIntro,
      `${t.contact.name}: ${formData.name}`,
      `${t.contact.email}: ${formData.email}`,
      `${t.contact.phone}: ${formData.phone}`,
      `${t.contact.whatsappMessageLabel}: ${formData.message}`,
    ].join("\n");
    window.open(
      `https://wa.me/5511947219180?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    toast.success(t.contact.toast);
  };

  const navItems = [
    [t.nav.about, "#escritorio"],
    [t.nav.practice, "#areas"],
    [h.perspectivesNav, "#perspectivas"],
    [t.nav.information, "#informacoes"],
    [t.nav.contact, "#contato"],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090909]/94 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <nav className="container flex h-[78px] items-center justify-between gap-3">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="JFG Advocacia">
            <span className="logo-plaque logo-plaque-header">
              <img src="/images/logo-jfg-white.png" alt="JFG" className="h-full w-full object-contain" />
            </span>
            <div className="hidden min-w-0 border-l border-white/20 pl-3 sm:block">
              <p className="font-display text-base leading-none tracking-wide">JFG Advocacia</p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.22em] text-white/55">{t.brandSubtitle}</p>
            </div>
          </a>

          <div className="hidden items-center gap-4 xl:flex 2xl:gap-6">
            {navItems.map(([label, href]) => <a key={href} href={href} className="nav-link">{label}</a>)}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector language={language} onChange={selectLanguage} label={t.languageSelector} />
            <Button asChild className="hidden rounded-none bg-[#b4935d] px-4 text-black shadow-none hover:bg-[#ccb07d] md:inline-flex">
              <a href="#contato">{t.nav.schedule}</a>
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white xl:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-white/10 bg-[#090909] xl:hidden">
            <div className="container grid py-4">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="border-b border-white/10 py-3 text-sm text-white/80 last:border-0">
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="inicio" className="hybrid-hero pt-[78px]">
          <div className="hybrid-hero-grid">
            <div className="hybrid-hero-copy">
              <div className="hybrid-eyebrow"><span />{t.hero.eyebrow}</div>
              <h1 className="hybrid-hero-title">{h.heroTitle}</h1>
              <p className="hybrid-hero-description">{h.heroDescription}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="group rounded-none bg-[#b4935d] px-7 text-black hover:bg-[#ccb07d]">
                  <a href="#contato">{t.hero.primaryCta}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-none border-white/30 bg-transparent px-7 text-white hover:bg-white hover:text-black">
                  <a href="#areas">{t.hero.secondaryCta}</a>
                </Button>
              </div>
            </div>

            <div className="hybrid-hero-image-wrap">
              <img src="/images/hero-image.jpeg" alt={t.hero.imageAlt} className="hybrid-hero-image" />
              <div className="hybrid-hero-image-shade" />
              <p className="hybrid-image-caption">JFG · São Paulo</p>
            </div>

            <aside className="hybrid-hero-rail" aria-label={h.presence}>
              <div className="hybrid-rail-words">{h.heroRail.map((word) => <span key={word}>{word}</span>)}</div>
              <div className="hybrid-rail-index"><span /><strong>01</strong><small>{h.presence}</small></div>
            </aside>
          </div>

          <div className="hybrid-pillar-strip">
            <div className="container grid gap-px md:grid-cols-3">
              {t.hero.pillars.map((item) => (
                <div key={item} className="hybrid-pillar"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#d2b77f]" />{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="escritorio" className="paper-texture hybrid-essence">
          <div className="container">
            <div className="hybrid-essence-grid">
              <div>
                <p className="section-kicker">{t.about.kicker}</p>
                <h2 className="hybrid-editorial-title mt-5">{h.aboutLead}<em>{h.aboutAccent}</em></h2>
                <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] leading-8 text-muted-foreground">
                  {t.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <a href="#abordagem" className="hybrid-text-link mt-9">{h.aboutCta}<ArrowDownRight className="h-4 w-4" /></a>
              </div>
              <div className="hybrid-essence-visual">
                <div className="hybrid-essence-photo"><img src="/images/about-image.jpg" alt={t.about.imageAlt} /></div>
                <div className="hybrid-keywords">{h.aboutKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
              </div>
            </div>
            <div className="hybrid-essence-steps">
              {t.about.steps.map((label, index) => <div key={label}><span>0{index + 1}</span><p>{label}</p></div>)}
            </div>
          </div>
        </section>

        <section id="areas" className="hybrid-practice">
          <div className="container">
            <div className="hybrid-section-intro">
              <div><p className="section-kicker text-[#d2b77f]">{t.practice.kicker}</p><h2 className="hybrid-editorial-title hybrid-editorial-title-light mt-5">{t.practice.title}</h2></div>
              <p>{t.practice.intro}</p>
            </div>
            <div className="hybrid-practice-list">
              {t.practice.areas.map(([title, description], index) => {
                const AreaIcon = practiceIcons[index];
                return (
                  <details key={title} className="practice-row">
                    <summary>
                      <span className="practice-number">0{index + 1}</span>
                      <span className="practice-icon"><AreaIcon className="h-5 w-5" /></span>
                      <span className="practice-copy"><strong>{title}</strong><small>{description}</small></span>
                      <ChevronDown className="practice-chevron h-5 w-5" />
                    </summary>
                    <div className="practice-detail"><p>{h.practicePrompt}</p><a href="#preparar-contato" onClick={() => prepareAreaContact(title)}>{h.practiceCta}<ArrowRight className="h-4 w-4" /></a></div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        <section id="abordagem" className="hybrid-approach subtle-grid">
          <div className="container hybrid-approach-grid">
            <div>
              <p className="section-kicker">{h.approachKicker}</p>
              <h2 className="hybrid-editorial-title mt-5">{h.approachTitle}</h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">{h.approachIntro}</p>
              <Button asChild className="mt-8 rounded-none bg-[#0b0b0b] text-white hover:bg-[#252525]"><a href="#contato">{h.approachCta}<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
            </div>
            <ol className="hybrid-process-list">
              {h.approachSteps.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section id="perspectivas" className="hybrid-perspectives">
          <div className="container">
            <div className="hybrid-perspectives-heading">
              <div><p className="section-kicker text-[#d2b77f]">{h.perspectivesKicker}</p><h2 className="hybrid-editorial-title hybrid-editorial-title-light mt-5">{h.perspectivesTitle}</h2></div>
              <div className="hybrid-perspective-tags">{h.perspectivesTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="hybrid-perspective-grid">
              {h.perspectives.map(([category, title, excerpt], index) => (
                <article key={title} className="hybrid-perspective-card">
                  <div className="hybrid-card-meta"><span>{category}</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
                  <h3>{title}</h3><p>{excerpt}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-xs leading-5 text-white/38">{h.perspectivesDisclaimer}</p>
          </div>
        </section>

        <section id="informacoes" className="hybrid-public-info">
          <div className="container hybrid-public-grid">
            <div>
              <p className="section-kicker">{t.publicInfo.kicker}</p>
              <h2 className="hybrid-editorial-title mt-5">{t.publicInfo.title}</h2>
              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">{t.publicInfo.intro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2" aria-live="polite">
              <article className="hybrid-data-card">
                <div className="flex items-start justify-between gap-3"><div className="hybrid-data-icon"><TrendingUp className="h-5 w-5" /></div><span className="hybrid-data-source">{t.publicInfo.centralBank}</span></div>
                <p className="mt-8 text-sm text-[#606060]">{t.publicInfo.selicLabel}</p>
                <p className="mt-1 font-display text-5xl text-[#0b0b0b]">{publicInfo.loading ? "—" : publicInfo.selic ? `${Number(publicInfo.selic).toLocaleString(t.locale)}%` : t.publicInfo.unavailable}</p>
                <p className="mt-3 min-h-5 text-xs text-[#858585]">{publicInfo.selicDate ? `${t.publicInfo.updated} ${formatBcbDate(publicInfo.selicDate)}` : t.publicInfo.selicFallback}</p>
                <a href="https://www.bcb.gov.br/controleinflacao/taxaselic" target="_blank" rel="noreferrer" className="hybrid-source-link">{t.publicInfo.officialSource}<ExternalLink className="h-3.5 w-3.5" /></a>
              </article>
              <article className="hybrid-data-card">
                <div className="flex items-start justify-between gap-3"><div className="hybrid-data-icon"><CalendarDays className="h-5 w-5" /></div><span className="hybrid-data-source">{t.publicInfo.nationalCalendar}</span></div>
                <p className="mt-8 text-sm text-[#606060]">{t.publicInfo.nextHoliday}</p>
                <p className="mt-2 font-display text-3xl leading-tight text-[#0b0b0b]">{publicInfo.loading ? t.publicInfo.loading : publicInfo.holidayName ? translateHoliday(publicInfo.holidayName, language) : t.publicInfo.unavailable}</p>
                <p className="mt-3 min-h-5 text-xs text-[#858585]">{publicInfo.holidayDate ? formatApiDate(publicInfo.holidayDate) : t.publicInfo.holidayFallback}</p>
                <a href="https://brasilapi.com.br/docs#tag/Feriados-Nacionais" target="_blank" rel="noreferrer" className="hybrid-source-link">{t.publicInfo.viewSource}<ExternalLink className="h-3.5 w-3.5" /></a>
              </article>
              <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">{t.publicInfo.disclaimer}</p>
            </div>
          </div>
        </section>

        <section id="contato" className="hybrid-contact">
          <div className="hybrid-contact-band">
            <div className="hybrid-contact-callout">
              <p>{h.contactKicker}</p><h2>{h.contactTitle}</h2>
              <Button size="lg" asChild className="mt-8 rounded-none border border-black bg-black px-7 text-white hover:bg-transparent hover:text-black"><a href="#preparar-contato">{h.prepareContact}<ArrowDownRight className="ml-2 h-4 w-4" /></a></Button>
            </div>
            <div className="hybrid-contact-data">
              <div><h3>{t.contact.address}</h3><p>R. Cap. Antônio Rosa, 409 - Pinheiros,<br />São Paulo - SP, CEP 01443-010.</p><a href={officeMapUrl} target="_blank" rel="noreferrer">{t.contact.viewMap}<ExternalLink className="h-3.5 w-3.5" /></a></div>
              <div><h3>{h.contactHeading}</h3><p><a href="tel:+551128882133">(11) 2888-2133</a><br /><a href="tel:+5511947219180">(11) 9 4721-9180</a><br /><a href="mailto:contato@jfg.adv.br">contato@jfg.adv.br</a></p></div>
              <div><h3>{t.contact.service}</h3><p>{t.contact.weekdays}<br />{t.contact.saturday}</p></div>
            </div>
          </div>

          <div id="preparar-contato" className="paper-texture py-20 lg:py-28">
            <div className="container hybrid-contact-form-grid">
              <div>
                <p className="section-kicker">{t.contact.kicker}</p><h2 className="hybrid-editorial-title mt-5">{t.contact.title}</h2><p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">{t.contact.intro}</p>
                <div className="mt-9 space-y-5 text-sm text-[#555555]">
                  <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#927447]" />(11) 9 4721-9180</p>
                  <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#927447]" />contato@jfg.adv.br</p>
                  <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-[#927447]" />{t.contact.weekdays}</p>
                  <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#927447]" />Pinheiros · São Paulo</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="hybrid-contact-form">
                <div><label htmlFor="name" className="form-label">{t.contact.name}</label><input id="name" value={formData.name} onChange={handleChange} className="form-field" placeholder={t.contact.namePlaceholder} required /></div>
                <div><label htmlFor="phone" className="form-label">{t.contact.phone}</label><input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="form-field" placeholder="(11) 99999-9999" required /></div>
                <div className="sm:col-span-2"><label htmlFor="email" className="form-label">{t.contact.email}</label><input type="email" id="email" value={formData.email} onChange={handleChange} className="form-field" placeholder={t.contact.emailPlaceholder} required /></div>
                <div className="sm:col-span-2"><label htmlFor="message" className="form-label">{t.contact.message}</label><textarea id="message" rows={5} value={formData.message} onChange={handleChange} className="form-field resize-none" placeholder={t.contact.messagePlaceholder} required /></div>
                <div className="sm:col-span-2"><Button type="submit" size="lg" className="group w-full rounded-none bg-[#0b0b0b] text-white hover:bg-[#252525] sm:w-auto">{t.contact.submit}<MessageSquareText className="ml-2 h-4 w-4" /></Button></div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505] py-12 text-white">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
            <div><span className="logo-plaque logo-plaque-footer"><img src="/images/logo-jfg-white.png" alt="JFG" className="h-full w-full object-contain" /></span><p className="mt-4 max-w-sm text-sm leading-6 text-white/48">{t.footer.description}</p><p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{t.footer.followUs}</p><a href="https://br.linkedin.com/company/jfg-advocacia-consultoria-jur%C3%ADdica" target="_blank" rel="noreferrer" className="social-link mt-3" aria-label="LinkedIn"><Linkedin className="h-4.5 w-4.5" /></a></div>
            <div><h3 className="footer-heading">{t.footer.quickLinks}</h3><ul className="mt-5 space-y-3 text-sm text-white/55">{navItems.map(([label, href]) => <li key={href}><a href={href} className="hover:text-[#d2b77f]">{label}</a></li>)}</ul></div>
            <div><h3 className="footer-heading">{t.footer.officeData}</h3><div className="mt-5 space-y-2 text-sm leading-6 text-white/55"><p>CNPJ: 63.795.411/0001-30</p><p>OAB/SP: 504.270</p><p><a href={officeMapUrl} target="_blank" rel="noreferrer" className="hover:text-[#d2b77f]">R. Cap. Antônio Rosa, 409 - Pinheiros, São Paulo - SP, CEP 01443-010.</a></p></div></div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} JFG Advocacia. {t.footer.rights}</p><p>{t.footer.disclaimer}</p></div>
        </div>
      </footer>

      <WhatsAppButton ariaLabel={t.contact.floatingWhatsapp} message={t.contact.floatingWhatsappMessage} />
    </div>
  );
}
