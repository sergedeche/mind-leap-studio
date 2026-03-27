import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Cpu, Zap, Clock, Users, Target, Briefcase, Building2,
  TrendingUp, Award, Shield, Lightbulb, BookOpen, Wrench,
  MessageSquare, BarChart3, Brain, Layers, Rocket, CheckCircle2,
  MapPin, Calendar, ArrowRight, Sparkles, Play, BadgeCheck, ChevronLeft, ChevronRight
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpeg";
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
              <GlassCard className="flex h-full flex-col p-6 sm:p-7">
                <span className="mb-4 text-4xl leading-none text-primary/40">"</span>
                <p className="flex-1 text-[15px] leading-relaxed text-muted-foreground text-pretty">
                  {text}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-center gap-4">
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
    offset: ["start 0.9", "start 0.15"],
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


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <span className="text-lg font-bold tracking-tight text-foreground">AI Masterclass</span>
          <div className="hidden items-center gap-8 sm:flex">
            <a href="#learn" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Программа</a>
            <a href="#author" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Автор</a>
            <a href="#cta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Стоимость</a>
          </div>
          <a href="#cta" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/85 hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] active:scale-[0.97]">
            Предзапись
          </a>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </nav>

      {/* ── HERO ── */}
      <header className="relative flex min-h-screen items-center justify-center pt-[72px]">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />
        
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px] animate-glow-pulse" />
        
        <Section className="relative z-10 py-24 sm:py-32 text-center">
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

          <Animate delay={200}>
            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty">
              Как использовать ИИ в работе, чтобы получить максимум результатов и&nbsp;опередить конкурентов
            </p>
          </Animate>

          <Animate delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#cta" className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:shadow-[0_0_50px_-5px_hsl(var(--primary)/0.7)] active:scale-[0.97]">
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

      {/* ── SCROLL REVEAL TEXT ── */}
      <ScrollRevealText text="Как использовать ИИ в работе, чтобы получить максимум результатов и опередить конкурентов" />

      {/* ── ВЫ УЗНАЕТЕ ── */}
      <Section id="learn" className="py-28 lg:py-36">
        <Animate>
          <SectionBadge icon={BookOpen} label="Вы узнаете" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            На мастер-классе вы узнаете
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            Практические знания, которые можно применить уже на следующий день
          </p>
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
      </Section>

      {/* ── ДЛЯ КОГО ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={Users} label="Для кого" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Для кого этот мастер-класс
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            Программа разработана для людей, которые принимают стратегические решения
          </p>
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

      {/* ── РЕЗУЛЬТАТЫ ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={Award} label="Результаты" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            После мастер-класса вы
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            Конкретные результаты, которые вы получите
          </p>
        </Animate>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: TrendingUp, text: "Будете точно знать, какие задачи отдать ИИ — и сэкономите десятки часов в месяц" },
            { icon: Award, text: "Получите готовый план внедрения ИИ в вашу компанию" },
            { icon: Shield, text: "Сможете контролировать процессы, а не тонуть в операционке" },
            { icon: Lightbulb, text: "Начнёте принимать стратегические решения, опираясь на ИИ-аналитику" },
          ].map((item, i) => (
            <Animate key={i} delay={i * 80}>
              <GlassCard className="flex items-start gap-4 p-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <p className="text-[15px] leading-relaxed text-secondary-foreground text-pretty">{item.text}</p>
              </GlassCard>
            </Animate>
          ))}
        </div>
      </Section>

      {/* ── СТАТИСТИКА ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <GlassCard hover={false} className="p-10 sm:p-16 lg:p-20">
            <SectionBadge icon={BarChart3} label="Статистика" />
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Почему{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                важно
              </span>{" "}
              идти сейчас
            </h2>
            <p className="mx-auto mb-14 max-w-md text-center text-base text-muted-foreground text-pretty">
              Рынок ИИ стремительно растёт — те, кто начнёт сейчас, получат преимущество
            </p>
            <div className="grid gap-10 sm:grid-cols-3">
              <StatCard stat="5%" label="компаний используют ИИ стратегически" delay={0} />
              <StatCard stat="→ 50%" label="будут использовать к 2027 году" delay={100} />
              <StatCard stat="3×" label="рост продуктивности при грамотном внедрении" delay={200} />
            </div>
          </GlassCard>
        </Animate>
      </Section>

      {/* ── ЧЕМ ОТЛИЧАЕТСЯ ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={Sparkles} label="Преимущества" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Чем отличается от других
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            Это не лекция по нейросетям — это стратегическая сессия для вашего бизнеса
          </p>
        </Animate>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, text: "Стратегический подход, а не перечисление нейросетей" },
            { icon: BarChart3, text: "Реальные кейсы из российского бизнеса" },
            { icon: MessageSquare, text: "Живое общение и ответы на ваши вопросы" },
            { icon: Layers, text: "Готовые шаблоны и чек-листы для внедрения" },
            { icon: Rocket, text: "Практика прямо на мастер-классе — вы уйдёте с результатом" },
          ].map((item, i) => (
            <Animate key={i} delay={i * 80}>
              <GlassCard className="flex items-start gap-4 p-6">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                <p className="text-[15px] leading-relaxed text-secondary-foreground text-pretty">{item.text}</p>
              </GlassCard>
            </Animate>
          ))}
        </div>
      </Section>

      {/* ── ПРОГРАММА ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={BookOpen} label="Программа" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Программа мастер-класса
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            6 модулей интенсивной работы за 4 часа
          </p>
        </Animate>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProgramBlock num={1} title="Введение в ИИ для бизнеса" desc="Что такое ИИ сегодня — без мифов. Какие задачи он решает, а какие пока нет." delay={0} />
          <ProgramBlock num={2} title="Аудит процессов" desc="Как найти зоны, где ИИ даст максимальный эффект именно в вашей компании." delay={80} />
          <ProgramBlock num={3} title="Инструменты и платформы" desc="Обзор проверенных решений: от ChatGPT до специализированных платформ для бизнеса." delay={160} />
          <ProgramBlock num={4} title="Автоматизация и интеграция" desc="Как встроить ИИ в существующие процессы без ломки системы." delay={240} />
          <ProgramBlock num={5} title="Команда и культура" desc="Как подготовить сотрудников и выстроить ИИ-культуру в компании." delay={320} />
          <ProgramBlock num={6} title="Стратегия и дорожная карта" desc="Составляем план внедрения ИИ на ближайшие 3–6 месяцев." delay={400} />
        </div>
      </Section>

      {/* ── ФОРМАТ ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <GlassCard hover={false} className="p-10 sm:p-14">
            <SectionBadge icon={MapPin} label="Формат" />
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              Формат проведения
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: MapPin, title: "Офлайн", desc: "Живое мероприятие с личным общением" },
                { icon: Clock, title: "4 часа", desc: "Интенсивный формат без воды" },
                { icon: MessageSquare, title: "Нетворкинг", desc: "Общение с единомышленниками и спикером" },
              ].map((item, i) => (
                <Animate key={i} delay={i * 100}>
                  <div className="text-center">
                    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mb-1.5 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
                  </div>
                </Animate>
              ))}
            </div>
          </GlassCard>
        </Animate>
      </Section>

      {/* ── CTA ── */}
      <Section id="cta" className="py-24 lg:py-32">
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
              <a href="#" className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_40px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-5px_hsl(var(--primary)/0.7)] active:scale-[0.97]">
                Оставить предзапись
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Animate>
      </Section>

      {/* ── АВТОР ── */}
      <Section id="author" className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={Sparkles} label="Автор и спикер" />
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Автор и спикер
          </h2>
        </Animate>
        <Animate delay={120}>
          <GlassCard hover={false} className="mx-auto max-w-2xl overflow-hidden p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-2/5">
                <img src={speakerImg} alt="Сергей Черненко" className="h-64 w-full object-cover object-top sm:h-full" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:w-3/5 sm:p-8">
                <h3 className="mb-1.5 text-2xl font-bold text-foreground">Сергей Черненко</h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Эксперт с 20+ летним опытом в международных компаниях, Совет директоров</span></li>
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Основатель агентства по автоматизации бизнеса через ИИ</span></li>
                  <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>Автор курсов по нетворкингу, карьерному росту, публичным выступлениям и ИИ</span></li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </Animate>
      </Section>

      {/* ── ОТЗЫВЫ ── */}
      <Section className="py-24 lg:py-32">
        <Animate>
          <SectionBadge icon={MessageSquare} label="Отзывы" />
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Что говорят{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              участники
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-base text-muted-foreground text-pretty">
            Реальные отзывы участников мероприятий Сергея
          </p>
        </Animate>
        <TestimonialsCarousel />
      </Section>

      {/* ── FOOTER ── */}
      <footer className="py-12">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-10" />
          <div className="flex flex-col items-center gap-5 text-center text-xs text-muted-foreground">
            <p>ИП Черненко Сергей&ensp;·&ensp;ИНН 366118088498&ensp;·&ensp;ОГРН 322366800055498</p>
            <div className="flex gap-5">
              <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">Политика конфиденциальности</a>
              <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">Оферта</a>
            </div>
            <p>© {new Date().getFullYear()} Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
