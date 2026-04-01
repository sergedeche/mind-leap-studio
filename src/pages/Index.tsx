import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Cpu, Zap, Clock, Users, Target, Briefcase, Building2,
  TrendingUp, Award, Shield, Lightbulb, BookOpen, Wrench,
  MessageSquare, BarChart3, Brain, Layers, Rocket, CheckCircle2,
  MapPin, Calendar, ArrowRight, Sparkles, Play, BadgeCheck, ChevronLeft, ChevronRight,
  Home, Menu, X
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpeg";
import formatBg from "@/assets/format-bg.jpeg";
import audience1 from "@/assets/audience-1.jpeg";
import audience2 from "@/assets/audience-2.jpeg";
import speakerImg from "@/assets/speaker.jpeg";
import useEmblaCarousel from "embla-carousel-react";

/* ─── animated section wrapper ─── */
function Animate({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── section badge (pill) ─── */
function SectionBadge({ icon: Icon, label }: { icon?: React.ElementType; label: string }) {
  return (
    <div className="mb-6 flex justify-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
        {label}
      </span>
    </div>
  );
}

/* ─── section container ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative px-5 sm:px-8 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-[1120px]">{children}</div>
    </section>
  );
}

/* ─── glass card ─── */
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md transition-all duration-500 ${hover ? "hover:border-primary/30 hover:bg-card/60 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.15)]" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ─── numbered program block ─── */
function ProgramBlock({ num, title, desc, delay }: { num: number; title: string; desc: string; delay: number }) {
  return (
    <Animate delay={delay}>
      <GlassCard className="p-6 sm:p-7">
        <div className="flex gap-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary ring-1 ring-primary/20">
            {String(num).padStart(2, "0")}
          </span>
          <div>
            <h3 className="mb-1.5 text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>
          </div>
        </div>
      </GlassCard>
    </Animate>
  );
}

/* ─── stat card ─── */
function StatCard({ stat, label, delay }: { stat: string; label: string; delay: number }) {
  return (
    <Animate delay={delay}>
      <div className="text-center">
        <p className="mb-3 text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">{stat}</p>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{label}</p>
      </div>
    </Animate>
  );
}

const testimonials = [
  "Сегодня применила полученные на вчерашней встрече знания, и не могу не поделиться с Вами своими успехами: рутинную работу, на которую я потратила бы несколько часов, я выполнила всего за полчаса, причем качество получилось на порядок выше. Огромная Вам благодарность за полезный контент без воды",
  "Сережа, еще раз спасибо за шикарное мероприятие! Ты как всегда меня вдохновил! Завтра вместо безделья в офисе буду накидывать план использования ИИ в жизни — а то прогресс летит вперед, а я почему-то отстаю)",
  "Сергей обозначил некоторые пункты, о которых я еще не задумывалась. А именно не использовать только для креативных задач, а использовать для рутинных и именно ненавистных задач. Я для себя записала несколько инсайтов. Это было незабываемо.",
  "Я очень благодарна Сергею Черненко за то, что он пригласил меня на этот потрясающий мастер-класс. И как маркетолог я использую искусственный интеллект в ряде выполнений своих задач. Но сегодня я посмотрела на этот инструмент совершенно иначе и начну использовать все больше и больше возможностей, повышая и свою эффективность, и эффективность команды, с которой я работаю. Потрясающе!",
  "Сегодня Сергей открыл для меня очень большой мир, в котором я еще не бывала. Он показал мне новые разные функции и возможности чата GPT. Он показал разные возможности использования рутинных задач и делегирования искусственному интеллекту. Я узнала о тех приложениях, о которых не знала, и у меня возникло уже куча идей. Очень рекомендую к посещению всем руководителям, директорам разных направлений. Отдельная благодарность Сергею за организацию на высшем уровне подачи материала, очень интересная проработка кейсов. Сразу практика.",
];

function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, skipSnaps: false });
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setCount(emblaApi.scrollSnapList().length);
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {testimonials.map((text, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <GlassCard className="flex flex-col items-center p-6 sm:p-7 text-center">
                <span className="text-4xl leading-none text-primary/40">"</span>
                <p className="my-4 text-[15px] leading-relaxed text-muted-foreground text-pretty">
                  {text}
                </p>
                <span className="text-4xl leading-none text-primary/40">"</span>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
          aria-label="Предыдущий"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === selected ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
          aria-label="Следующий"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
/* ─── scroll reveal text (Nubien-style) ─── */
function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "start 0.15"],
  });

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <div ref={containerRef} className="relative py-0 px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-balance">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </ScrollWord>
            );
          })}
        </p>
      </div>
    </div>
  );
}

function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.04, 1]);
  const color = useTransform(opacity, [0.04, 1], [
    "hsl(var(--muted-foreground) / 0.06)",
    "hsl(var(--foreground))",
  ]);

  return (
    <motion.span style={{ color }} className="inline-block mr-[0.25em] transition-none">
      {children}
    </motion.span>
  );
}
/* ─── decorative divider ─── */
function PurpleDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary/50">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
      </svg>
      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
    </div>
  );
}
/* ─── navbar ─── */
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "#learn", label: "Вы узнаете" },
    { href: "#audience", label: "Для кого" },
    { href: "#program", label: "Программа" },
    { href: "#format", label: "Формат" },
    { href: "#cta", label: "Стоимость" },
    { href: "#author", label: "Об авторе" },
    { href: "#reviews", label: "Отзывы" },
  ];

  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Left: home icon */}
        <a href="https://sergeichernenko.ru/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-full p-2 text-foreground/80 transition-colors hover:text-foreground">
          <Home className="h-5 w-5" />
        </a>

        {/* Center: desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + mobile burger */}
        <div className="flex items-center gap-3">
          <a href="https://t.me/corphacker?direct" target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/85 hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97]">
            Предзапись
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center rounded-full p-2 text-foreground/80 transition-colors hover:text-foreground md:hidden"
            aria-label="Меню"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background/80 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-4 pt-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* ── NAV ── */}
      <NavBar />

      {/* ── HERO ── */}
      <header className="relative flex min-h-[70vh] items-center justify-center pt-[72px]">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />
        
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px] animate-glow-pulse" />
        
        <Section className="relative z-10 py-12 sm:py-16 text-center">
          <Animate>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Мастер-класс по ИИ для бизнеса
            </span>
          </Animate>

          <Animate delay={100}>
            <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Код стратегического{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                превосходства
              </span>
            </h1>
          </Animate>



          <Animate delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://t.me/corphacker?direct" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:shadow-[0_0_50px_-5px_hsl(var(--primary)/0.7)] active:scale-[0.97]">
                Предзапись
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#learn" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-card/70 hover:border-border/80">
                Подробнее
              </a>
            </div>
          </Animate>
        </Section>
      </header>

      <PurpleDivider />

      {/* ── SCROLL REVEAL TEXT ── */}
      <ScrollRevealText text="Как использовать ИИ в работе, чтобы получить максимум результатов и опередить конкурентов" />

      <PurpleDivider />

      {/* ── ВЫ УЗНАЕТЕ ── */}
      <Section id="learn" className="py-6 lg:py-8">
        <Animate>
          <h2 className="mb-12 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            <Lightbulb className="h-8 w-8 text-primary sm:h-10 sm:w-10 shrink-0" />
            На мастер-классе вы узнаете
          </h2>
        </Animate>
        <div className="mx-auto max-w-2xl space-y-5">
          {[
            "Какие инструменты ИИ реально работают и как их внедрять без лишних затрат",
            "Как автоматизировать рутину и ускорить процессы с помощью нейросетей",
            "Где вы теряете время и деньги — и как ИИ это исправит",
            "Как выстроить команду, которая работает с ИИ эффективно",
            "Как принимать стратегические решения, опираясь на данные и ИИ-аналитику",
          ].map((item, i) => (
            <Animate key={i} delay={i * 80}>
              <div className="flex items-start gap-4">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <span className="text-lg text-muted-foreground">{item}</span>
              </div>
            </Animate>
          ))}
        </div>
        <Animate delay={450}>
          <p className="mt-10 text-center text-lg font-medium text-primary sm:text-xl">
            Разбираем все инструменты, которые были использованы для создания этого мастер-класса
          </p>
        </Animate>
        {/* Tools marquee */}
        <div className="relative mt-12 overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="flex animate-marquee">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex shrink-0 items-center gap-16 pr-16">
                {[
                  { name: "ChatGPT", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg> },
                  { name: "Perplexity", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"/></svg> },
                  { name: "NotebookLM", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M11.999 3.201C5.372 3.201 0 8.528 0 15.101V20.8h2.212v-.568c0-2.666 2.178-4.827 4.866-4.827 2.688 0 4.866 2.16 4.866 4.827v.568h2.212v-.568c0-3.877-3.17-7.019-7.078-7.019A7.075 7.075 0 0 0 2.992 14.5a7.355 7.355 0 0 1 6.568-4.016c4.057 0 7.347 3.264 7.347 7.287V20.8h2.212V17.77c0-5.235-4.28-9.481-9.56-9.481a9.563 9.563 0 0 0-6.217 2.28A9.795 9.795 0 0 1 12 5.393c5.406 0 9.788 4.346 9.788 9.707V20.8H24V15.1c-.001-6.573-5.373-11.9-12.001-11.9Z"/></svg> },
                  { name: "Cursor AI", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg> },
                  { name: "N8N", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263"/></svg> },
                  { name: "Higgsfield", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M4 3v18h3v-7.5h10V21h3V3h-3v7.5H7V3z"/></svg> },
                  { name: "Krea", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><text x="12" y="17" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">K</text></svg> },
                  { name: "NanoBanana", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12 2C9.5 2 7.5 4.5 7 8c-.5 3.5 0 7 1.5 10 .8 1.6 2 3 3.5 4 1.5-1 2.7-2.4 3.5-4 1.5-3 2-6.5 1.5-10C16.5 4.5 14.5 2 12 2zm0 2c1.5 0 2.8 1.8 3.2 4.5.4 2.8 0 5.8-1.2 8.2-.4.8-.9 1.5-1.5 2.1-.6-.6-1.1-1.3-1.5-2.1C9.8 14.3 9.4 11.3 9.8 8.5 10.2 5.8 11.5 4 13 4z"/></svg> },
                  { name: "Lovable", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
                  { name: "Kling", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.3L20 9v6l-8 4-8-4V9l8-4.7z"/><path d="M12 8v8l6-4z"/></svg> },
                  { name: "Suno", icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M16.5 0C20.642 0 24 5.373 24 12h-9c0 6.627-3.358 12-7.5 12C3.358 24 0 18.627 0 12h9c0-6.627 3.358-12 7.5-12Z"/></svg> },
                ].map((tool) => (
                  <div key={tool.name} className="flex flex-col items-center gap-2 text-foreground/80">
                    {tool.icon}
                    <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{tool.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ВИДЕО ── */}
      <Section className="py-6 lg:py-8">
        <Animate>
          <div className="mx-auto max-w-3xl">
            <GlassCard className="overflow-hidden p-0" hover={false}>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://rutube.ru/play/embed/7f6ebdd6843542215ffb22bfd3ab2f40/"
                  className="absolute inset-0 h-full w-full"
                  frameBorder="0"
                  allow="clipboard-write; autoplay"
                  allowFullScreen
                />
              </div>
            </GlassCard>
          </div>
        </Animate>
      </Section>

      {/* ── ДЛЯ КОГО ── */}
      <Section id="audience" className="py-6 lg:py-8">
        <Animate>
          <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            <Users className="h-8 w-8 text-primary sm:h-10 sm:w-10 shrink-0" />
            Для кого этот мастер-класс
          </h2>
        </Animate>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { icon: Briefcase, title: "Управленцы и руководители", desc: "Топ-менеджеры, директора, руководители отделов, которые хотят внедрить ИИ в процессы компании и получить конкурентное преимущество", img: audience1 },
            { icon: Building2, title: "Собственники бизнеса", desc: "Предприниматели, которые хотят масштабировать бизнес с помощью ИИ, сократить издержки и принимать решения быстрее", img: audience2 },
          ].map((item, i) => (
            <Animate key={i} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60">
                {/* Background image */}
                <img src={item.img} alt="" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                {/* Content */}
                <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-8 sm:p-10">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 backdrop-blur-sm">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{item.desc}</p>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </Section>

      {/* ── ПРОГРАММА ── */}
      <Section id="program" className="py-6 lg:py-8">
        <Animate>
          <h2 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            <BookOpen className="h-8 w-8 text-primary sm:h-10 sm:w-10 shrink-0" />
            Программа мастер-класса
          </h2>
        </Animate>
        <div className="grid gap-4">
          {[
            {
              title: "Блок 1. Стратегический контекст: Почему ИИ — это приоритет №1 для лидера",
              items: [
                "Разбор текущей технологической революции: почему скорость изменений не оставляет времени на долгое изучение.",
                "ИИ как расширение мозга руководителя: переход от управления процессами к управлению интеллектом.",
                "Формирование нового мышления: почему владение ИИ становится обязательным стандартом профессионализма.",
              ],
            },
            {
              title: "Блок 2. Фундамент и методология: Как «думать» об ИИ",
              items: [
                "Принципы работы генеративных моделей: понимание логики системы для эффективного взаимодействия.",
                "Ключевой навык будущего: точность формулирования мыслей и запросов как новый язык управления.",
                "Критическое мышление и фильтрация результатов: как не допустить ошибок при делегировании задач нейросетям.",
              ],
            },
            {
              title: "Блок 3. Личная эффективность: ИИ как ваш стратегический актив",
              items: [
                "Роль «Виртуального совета директоров»: использование ИИ в качестве ментора и эксперта для проверки идей и поиска рисков.",
                "Мгновенная аналитика: проведение глубоких исследований и получение экспертных справок в любой сфере за считанные минуты.",
                "Освобождение ресурса: делегирование сложных и трудоемких задач, не приносящих прямой ценности.",
              ],
            },
            {
              title: "Блок 4. Управление командой и трансформация бизнеса",
              items: [
                "Аудит процессов: как выявлять потенциал для автоматизации и находить задачи, «съедающие» время сотрудников.",
                "Мотивация и внедрение: как помочь команде преодолеть страх перемен и использовать ИИ для кратного усиления своих компетенций.",
                "Подтягивание результатов: использование технологий для выравнивания эффективности сотрудников и создания «гибридных» команд.",
              ],
            },
            {
              title: "Блок 5. Проектирование будущего: Технологии без границ",
              items: [
                "Создание корпоративных баз знаний: как обучить ИИ на опыте вашей компании для сохранения экспертизы.",
                "Собственные ИТ-решения без кода: возможности разработки внутренних приложений и инструментов под конкретные нужды бизнеса без штата программистов.",
                "Автономные агенты: подготовка к переходу на системы, способные самостоятельно выполнять сложные цепочки задач.",
              ],
            },
          ].map((block, i) => (
            <Animate key={i} delay={i * 80}>
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-bold text-foreground">{block.title}</h3>
                <ul className="space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] leading-relaxed text-secondary-foreground">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Animate>
          ))}
        </div>
      </Section>

      {/* ── ФОРМАТ ── */}
      <Section id="format" className="py-6 lg:py-8">
        <Animate>
          <GlassCard hover={false} className="relative p-10 sm:p-14 overflow-hidden">
            <div className="absolute inset-0">
              <img src={formatBg} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            </div>
            <div className="relative z-10">
            <h2 className="mb-8 text-center text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Формат</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: MapPin, title: "Офлайн", desc: "Живое мероприятие с личным общением" },
                { icon: Clock, title: "3 часа", desc: "Интенсивный формат без воды" },
                { icon: MessageSquare, title: "Нетворкинг", desc: "Общение с другими участниками и спикером" },
              ].map((item, i) => (
                <Animate key={i} delay={i * 100}>
                  <div className="text-center">
                    <span className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <h3 className="mb-1 text-sm sm:text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-[10px] leading-tight sm:text-sm text-muted-foreground text-pretty">{item.desc}</p>
                  </div>
                </Animate>
              ))}
            </div>
            </div>
          </GlassCard>
        </Animate>
      </Section>

      {/* ── CTA ── */}
      <Section id="cta" className="py-6 lg:py-8">
        <Animate>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-10 text-center sm:p-16 lg:p-20">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card/80 to-card" />
            <div className="absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -bottom-32 left-1/2 h-48 w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
            
            <div className="relative z-10">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
                <Calendar className="h-3.5 w-3.5" />
                Ближайший мастер-класс
              </span>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-5xl text-balance">
                Код стратегического превосходства
              </h2>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-5 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-sm"><Calendar className="h-4 w-4" /> Дата уточняется</span>
                <span className="inline-flex items-center gap-1.5 text-sm"><MapPin className="h-4 w-4" /> Офлайн</span>
              </div>
              <p className="mb-10 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">14 900 ₽</p>
              <a href="https://t.me/corphacker?direct" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_40px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-5px_hsl(var(--primary)/0.7)] active:scale-[0.97]">
                Оставить заявку
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-8 text-sm text-muted-foreground text-pretty max-w-md mx-auto">
                Возможно проведение корпоративного мероприятия. Для уточнения деталей обращайтесь по ссылке выше.
              </p>
            </div>
          </div>
        </Animate>
      </Section>

      {/* ── АВТОР ── */}
      <Section id="author" className="py-6 lg:py-8">
        <Animate>
          <h2 className="mb-14 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            <Award className="h-8 w-8 text-primary sm:h-10 sm:w-10 shrink-0" />
            Автор и спикер
          </h2>
        </Animate>
        <Animate delay={120}>
          <GlassCard hover={false} className="mx-auto max-w-2xl overflow-hidden p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-2/5">
                <img src={speakerImg} alt="Сергей Черненко" className="w-full object-cover object-top sm:h-full" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:w-3/5 sm:p-8">
                <h3 className="mb-1.5 text-2xl font-bold text-foreground">Сергей Черненко</h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Эксперт с 20+ летним опытом в международных компаниях, Совет директоров</span></li>
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Основатель агентства по автоматизации бизнеса через ИИ</span></li>
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Автор курсов по нетворкингу, карьерному росту, публичным выступлениям и ИИ</span></li>
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Автор книги про карьеру «Я умер в понедельник»</span></li>
                </ul>
                <a href="https://sergeichernenko.ru/" target="_blank" rel="noopener noreferrer" className="mt-5 self-start inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                  Узнать больше <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </GlassCard>
        </Animate>
      </Section>

      {/* ── ОТЗЫВЫ ── */}
      <Section id="reviews" className="py-6 lg:py-8">
        <Animate>
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            <MessageSquare className="mr-2 inline-block h-7 w-7 text-primary sm:h-10 sm:w-10 align-middle" />
            Что говорят{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              участники
            </span>
          </h2>
        </Animate>
        <TestimonialsCarousel />
      </Section>

      {/* ── FOOTER ── */}
      <footer className="py-12">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-10" />
          <div className="flex flex-col items-center gap-5 text-center text-xs text-muted-foreground">
            <Animate>
              <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] animate-pulse">
                <Sparkles className="h-4 w-4" />
                Сайт сделан на 100% с помощью ИИ
              </span>
            </Animate>
            <p>ИП Черненко Сергей Владимирович&ensp;·&ensp;ИНН 773610555595&ensp;·&ensp;ОГРН 318774600294952</p>
            <div className="flex flex-wrap justify-center gap-5">
              <a href="https://corphacker.ru/polytic" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-foreground">Политика конфиденциальности</a>
              <a href="https://corphacker.ru/oferta" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-foreground">Оферта оказания услуг</a>
              <a href="https://nontsecrets.tilda.ws/personal" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-foreground">Обработка персональных данных</a>
              <a href="https://t.me/+79384533173" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-foreground">Служба поддержки</a>
            </div>
            <p>© {new Date().getFullYear()} Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
