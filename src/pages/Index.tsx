import { useEffect, useRef } from "react";
import {
  Cpu, Zap, Clock, Users, Target, Briefcase, Building2,
  TrendingUp, Award, Shield, Lightbulb, BookOpen, Wrench,
  MessageSquare, BarChart3, Brain, Layers, Rocket, CheckCircle2,
  MapPin, Calendar, ArrowRight
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpeg";

/* ─── scroll reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("animate-fade-up"); el.style.opacity = "1"; io.unobserve(el); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: 0, animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── section wrapper ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/* ─── glow card ─── */
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`group relative rounded-xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-[0_0_30px_-5px_hsl(265_80%_60%/0.25)] ${className}`}>
      {children}
    </div>
  );
}

/* ─── numbered program block ─── */
function ProgramBlock({ num, title, desc, delay }: { num: number; title: string; desc: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <GlowCard className="flex gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-lg font-bold text-primary tabular-nums">
          {num}
        </span>
        <div>
          <h3 className="mb-1.5 text-lg font-semibold leading-snug text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>
        </div>
      </GlowCard>
    </Reveal>
  );
}

/* ════════════════════════  PAGE  ════════════════════════ */

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-bold tracking-tight text-foreground">AI Masterclass</span>
          <a href="#cta" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-150 active:scale-[0.97] hover:bg-primary/85">
            Предзапись
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="relative flex min-h-[92vh] items-center pt-16">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />

        <Section className="relative z-10 py-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">Мастер-класс</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance" style={{ lineHeight: 1.08 }}>
              Код стратегического превосходства
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
              Как использовать ИИ в работе, чтобы получить максимум результатов и&nbsp;опередить конкурентов
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#cta" className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_24px_-4px_hsl(265_80%_60%/0.5)] transition-all duration-200 hover:shadow-[0_0_32px_-4px_hsl(265_80%_60%/0.7)] active:scale-[0.97]">
                Предзапись <ArrowRight className="h-4 w-4" />
              </a>
              <span className="text-sm text-muted-foreground">14 900 ₽</span>
            </div>
          </Reveal>
        </Section>
      </header>

      {/* ── ВЫ УЗНАЕТЕ ── */}
      <Section className="py-24 lg:py-32">
        <Reveal>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            На мастер-классе вы узнаете
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Wrench, text: "Какие инструменты ИИ реально работают и как их внедрять без лишних затрат" },
            { icon: Zap, text: "Как автоматизировать рутину и ускорить процессы с помощью нейросетей" },
            { icon: Clock, text: "Где вы теряете время и деньги — и как ИИ это исправит" },
            { icon: Users, text: "Как выстроить команду, которая работает с ИИ эффективно" },
            { icon: Target, text: "Как принимать стратегические решения, опираясь на данные и ИИ-аналитику" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <GlowCard className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="text-[15px] leading-relaxed text-secondary-foreground text-pretty">{item.text}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── ДЛЯ КОГО ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Для кого этот мастер-класс
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: Briefcase, title: "Управленцы и руководители", desc: "Топ-менеджеры, директора, руководители отделов, которые хотят внедрить ИИ в процессы компании и получить конкурентное преимущество" },
            { icon: Building2, title: "Собственники бизнеса", desc: "Предприниматели, которые хотят масштабировать бизнес с помощью ИИ, сократить издержки и принимать решения быстрее" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <GlowCard className="h-full">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">{item.desc}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── РЕЗУЛЬТАТЫ ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            После мастер-класса вы
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { icon: TrendingUp, text: "Будете точно знать, какие задачи отдать ИИ — и сэкономите десятки часов в месяц" },
            { icon: Award, text: "Получите готовый план внедрения ИИ в вашу компанию" },
            { icon: Shield, text: "Сможете контролировать процессы, а не тонуть в операционке" },
            { icon: Lightbulb, text: "Начнёте принимать стратегические решения, опираясь на ИИ-аналитику" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-[15px] leading-relaxed text-secondary-foreground text-pretty">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── СТАТИСТИКА ── */}
      <Section className="py-20 lg:py-28">
        <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-12 lg:p-16">
          <Reveal>
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Почему важно идти сейчас
            </h2>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { stat: "5%", label: "компаний используют ИИ стратегически" },
              { stat: "→ 50%", label: "будут использовать к 2027 году" },
              { stat: "3×", label: "рост продуктивности при грамотном внедрении" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="text-center">
                  <p className="mb-2 text-4xl font-extrabold tracking-tight text-primary tabular-nums sm:text-5xl">{item.stat}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ЧЕМ ОТЛИЧАЕТСЯ ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Чем отличается от других
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, text: "Стратегический подход, а не перечисление нейросетей" },
            { icon: BarChart3, text: "Реальные кейсы из российского бизнеса" },
            { icon: MessageSquare, text: "Живое общение и ответы на ваши вопросы" },
            { icon: Layers, text: "Готовые шаблоны и чек-листы для внедрения" },
            { icon: Rocket, text: "Практика прямо на мастер-классе — вы уйдёте с результатом" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="flex items-start gap-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-5">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-[15px] leading-relaxed text-secondary-foreground text-pretty">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── ПРОГРАММА ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Программа мастер-класса
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          <ProgramBlock num={1} title="Введение в ИИ для бизнеса" desc="Что такое ИИ сегодня — без мифов. Какие задачи он решает, а какие пока нет." delay={0} />
          <ProgramBlock num={2} title="Аудит процессов" desc="Как найти зоны, где ИИ даст максимальный эффект именно в вашей компании." delay={70} />
          <ProgramBlock num={3} title="Инструменты и платформы" desc="Обзор проверенных решений: от ChatGPT до специализированных платформ для бизнеса." delay={140} />
          <ProgramBlock num={4} title="Автоматизация и интеграция" desc="Как встроить ИИ в существующие процессы без ломки системы." delay={210} />
          <ProgramBlock num={5} title="Команда и культура" desc="Как подготовить сотрудников и выстроить ИИ-культуру в компании." delay={280} />
          <ProgramBlock num={6} title="Стратегия и дорожная карта" desc="Составляем план внедрения ИИ на ближайшие 3–6 месяцев." delay={350} />
        </div>
      </Section>

      {/* ── ФОРМАТ ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-12">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Формат
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: MapPin, title: "Офлайн", desc: "Живое мероприятие с личным общением" },
                { icon: Clock, title: "4 часа", desc: "Интенсивный формат без воды" },
                { icon: MessageSquare, title: "Нетворкинг", desc: "Общение с единомышленниками и спикером" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ── */}
      <Section id="cta" className="py-20 lg:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center sm:p-14">
            <div className="absolute -top-24 left-1/2 h-48 w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
            <div className="relative z-10">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.15em] text-primary">Ближайший мастер-класс</p>
              <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl text-balance">Код стратегического превосходства</h2>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-sm"><Calendar className="h-4 w-4" /> Дата уточняется</span>
                <span className="inline-flex items-center gap-1.5 text-sm"><MapPin className="h-4 w-4" /> Офлайн</span>
              </div>
              <p className="mb-8 text-4xl font-extrabold tracking-tight text-foreground tabular-nums">14 900 ₽</p>
              <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_32px_-4px_hsl(265_80%_60%/0.5)] transition-all duration-200 hover:shadow-[0_0_40px_-4px_hsl(265_80%_60%/0.7)] active:scale-[0.97]">
                Оставить предзапись <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── АВТОР ── */}
      <Section className="py-20 lg:py-28">
        <Reveal>
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Автор и спикер
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
              СЧ
            </div>
            <h3 className="mb-1 text-2xl font-bold text-foreground">Сергей Черненко</h3>
            <p className="mb-4 text-sm font-medium text-primary">Эксперт по внедрению ИИ в бизнес</p>
            <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Практик с опытом внедрения ИИ-решений в российские компании. Помогает руководителям и собственникам бизнеса
              использовать искусственный интеллект как стратегический инструмент для роста, автоматизации и принятия решений.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 py-10">
        <Section>
          <div className="flex flex-col items-center gap-4 text-center text-xs text-muted-foreground">
            <p>ИП Черненко Сергей&ensp;·&ensp;ИНН 366118088498&ensp;·&ensp;ОГРН 322366800055498</p>
            <div className="flex gap-4">
              <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">Политика конфиденциальности</a>
              <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">Оферта</a>
            </div>
            <p>© {new Date().getFullYear()} Все права защищены</p>
          </div>
        </Section>
      </footer>
    </div>
  );
};

export default Index;
