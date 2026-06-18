import { ValoreLogo, ValoreMark } from "@/components/brand/Logo";
import { motion, type Variants } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CreditCard,
  EyeOff,
  Lock,
  Shield,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const steps = [
  {
    number: "01",
    title: "Registre",
    desc: "Receitas, despesas e transferências em segundos. Categorias se sugerem sozinhas com o tempo.",
  },
  {
    number: "02",
    title: "Entenda",
    desc: "Veja para onde seu dinheiro vai mês a mês, por categoria, por conta — sem somar nada na mão.",
  },
  {
    number: "03",
    title: "Planeje",
    desc: "Compromissos futuros e parcelas já calculados, para decidir com o que está por vir.",
  },
];

const allInstallments = Array.from({ length: 12 }, (_, i) => ({
  n: i + 1,
  paid: i < 3,
}));

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-[#F2F4F0] overflow-x-hidden"
      style={{
        background: "#090B0A",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 35% at 15% 0%, rgba(76,138,106,0.12) 0%, transparent 70%), radial-gradient(45% 30% at 85% 8%, rgba(199,163,90,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 max-w-6xl mx-auto"
      >
        <ValoreLogo size={30} className="text-[#7DB99A]" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white/55 hover:text-white transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-colors duration-200"
          >
            Criar conta — grátis
          </button>
        </div>
      </motion.nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border border-[#C7A35A]/25 bg-[#C7A35A]/8 text-[#D9B36A] text-xs font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C7A35A]" />
          100% gratuito · Sem cartão de crédito
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display font-bold tracking-tight leading-[1.08] text-4xl md:text-[64px] mb-7 max-w-3xl"
        >
          <span className="text-white">Organize suas finanças.</span>
          <br />
          <span className="text-white/40">Sem transformar sua vida</span>
          <br />
          <span className="text-white/40">em uma planilha.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg text-white/50 max-w-md mb-9 leading-relaxed"
        >
          Contas, parcelas e análises em um só lugar — pensado para quem quer
          entender o próprio dinheiro, não estudar uma planilha.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-all duration-200"
          >
            Começar gratuitamente
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
          >
            Já tenho conta
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex items-center gap-3 text-white/25"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </motion.div>
          <span className="text-xs tracking-widest uppercase font-mono">
            Role para explorar
          </span>
        </motion.div>
      </section>

      {/* ─── CARDS FLUTUANTES ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24"
        style={{ marginTop: "-24px" }}
      >
        {/* Marca d'água do V */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <ValoreMark size={480} className="text-white/[0.015]" />
        </div>

        {/* Grid assimétrico de cards */}
        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {/* Card grande — Patrimônio */}
          <div
            className="col-span-2 md:col-span-1 md:row-span-2 rounded-2xl border border-white/[0.08] bg-[#0F1612] p-6 flex flex-col justify-between min-h-[160px] md:min-h-[280px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
            style={{ transform: "translateY(-8px)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4 text-white/35">
                <Wallet size={14} strokeWidth={1.5} />
                <span className="text-xs">Patrimônio líquido</span>
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-[#8FC4A6]">
                R$ 24.830
              </p>
              <p className="text-xs text-[#D9B36A] mt-2">
                ↑ 8,3% vs mês anterior
              </p>
            </div>
            <div className="mt-4 h-12 flex items-end gap-1">
              {[30, 45, 38, 55, 48, 62, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-[#4C8A6A]/35"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card — Compra parcelada */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
            style={{ transform: "translateY(12px)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/35">
              <CreditCard size={13} strokeWidth={1.5} />
              <span className="text-xs">Compra parcelada</span>
            </div>
            <p className="text-sm font-medium text-white/80 mb-2">Notebook</p>
            <p className="font-display text-xl font-bold text-[#D9B36A]">
              6x R$ 500
            </p>
            <div className="flex gap-1 mt-3">
              {[true, true, false, false, false, false].map((p, i) => (
                <span
                  key={i}
                  className={`flex-1 h-1 rounded-full ${p ? "bg-[#4C8A6A]" : "bg-white/10"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-white/30 mt-1.5">2 de 6 pagas</p>
          </div>

          {/* Card — Compromissos futuros */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
            style={{ transform: "translateY(-4px)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/35">
              <CalendarClock size={13} strokeWidth={1.5} />
              <span className="text-xs">Compromissos futuros</span>
            </div>
            <p className="font-display text-xl font-bold text-[#D9B36A]">
              R$ 2.000
            </p>
            <p className="text-xs text-white/35 mt-1">4 parcelas pendentes</p>
          </div>

          {/* Card — Análise mensal */}
          <div
            className="col-span-2 rounded-2xl border border-[#C7A35A]/15 bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
            style={{ transform: "translateY(4px)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/35">
              <BarChart3 size={13} strokeWidth={1.5} />
              <span className="text-xs">Análise mensal</span>
            </div>
            <div className="flex items-end gap-1 h-10">
              {[40, 65, 50, 80, 55, 90, 70, 45, 85, 60, 75, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-[#C7A35A]/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── DECLARAÇÃO EDITORIAL ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative z-20 max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center"
        style={{ marginTop: "-20px" }}
      >
        <span className="text-xs text-[#D9B36A]/60 tracking-widest uppercase mb-6 block font-mono">
          Filosofia
        </span>
        <p className="font-display text-2xl md:text-4xl font-semibold leading-snug tracking-tight text-white/90">
          Clareza é saber onde você está,
          <br />
          <span className="text-[#8FC4A6]">
            antes de decidir para onde vai.
          </span>
        </p>
      </motion.section>

      {/* ─── COMO FUNCIONA ────────────────────────────────────── */}
      <section
        className="relative z-20 max-w-4xl mx-auto px-6 md:px-10 pb-24 md:pb-32"
        style={{ marginTop: "-12px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-xs text-[#D9B36A]/60 tracking-widest uppercase mb-3 block font-mono">
            Como funciona
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Três passos. Sem curva de aprendizado.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Linha de conexão */}
          <div className="hidden md:block absolute top-6 left-7 right-7 h-px bg-gradient-to-r from-[#4C8A6A]/40 via-[#C7A35A]/40 to-[#4C8A6A]/10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl border border-[#4C8A6A]/30 bg-[#4C8A6A]/10 flex items-center justify-center">
                    <span className="font-mono text-sm text-[#8FC4A6] font-bold">
                      {step.number}
                    </span>
                  </div>
                  {i < 2 && (
                    <ArrowRight
                      size={14}
                      className="hidden md:block text-white/15 absolute -right-4 top-3.5"
                    />
                  )}
                </div>
                <h3 className="font-display font-semibold text-lg text-white/90 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARCELAMENTOS (fundo diferente) ─────────────────── */}
      <section
        className="relative z-20"
        style={{
          background:
            "linear-gradient(180deg, #090B0A 0%, #0D1511 15%, #0D1511 85%, #090B0A 100%)",
          marginTop: "-1px",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-xs text-[#D9B36A]/60 tracking-widest uppercase mb-5 block font-mono">
                Cartão de crédito
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6 tracking-tight">
                Cada parcela.
                <br />
                Cada vencimento.
                <br />
                <span className="text-[#D9B36A]">Sem surpresas.</span>
              </h2>
              <p className="text-sm md:text-base text-white/50 leading-relaxed mb-6">
                Compras parceladas se distribuem automaticamente pelos meses
                certos. Você sabe exatamente o que falta pagar — e quando.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-[#D9B36A]">
                  R$ 4.500
                </span>
                <span className="text-sm text-white/40">
                  em compromissos futuros
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#C7A35A]/15 bg-[#121814] p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-white/85">
                    iPhone 16 Pro
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    12x de R$ 500,00
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D9B36A] bg-[#C7A35A]/10 px-2 py-1 rounded-md">
                  R$ 4.500 restante
                </span>
              </div>

              <div className="space-y-3">
                {allInstallments.map((inst) => (
                  <div key={inst.n} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-all ${
                        inst.paid
                          ? "bg-[#4C8A6A] text-[#090B0A]"
                          : "border border-white/10 text-white/30"
                      }`}
                    >
                      {inst.n}
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      {inst.paid && (
                        <div
                          className="h-full rounded-full bg-[#4C8A6A]"
                          style={{ width: "100%" }}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-mono w-16 text-right ${
                        inst.paid ? "text-[#8FC4A6]" : "text-white/25"
                      }`}
                    >
                      {inst.paid ? "✓ pago" : "pendente"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANÁLISES FINANCEIRAS ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative z-20 max-w-4xl mx-auto px-6 md:px-10 py-24 md:py-32"
        style={{ marginTop: "-1px" }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-xs text-[#8FC4A6]/60 tracking-widest uppercase mb-3 block font-mono">
              Análises
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight max-w-sm">
              Números que ajudam a decidir
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs md:text-right">
            Evolução mensal, por categoria, despesas recorrentes e compromissos
            futuros — tudo em um só painel.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0D1511] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-white/50">Receitas vs Despesas</p>
            <span className="text-xs text-[#8FC4A6] bg-[#4C8A6A]/10 px-2.5 py-1 rounded-full">
              2026
            </span>
          </div>
          <div className="h-32 md:h-40 flex items-end gap-1.5 mb-3">
            {[35, 52, 44, 68, 50, 78, 60, 40, 72, 55, 66, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ height: `${h}%`, originY: 1 }}
                className={`flex-1 rounded-t-sm ${i % 2 === 0 ? "bg-[#4C8A6A]/50" : "bg-[#C7A35A]/35"}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-white/25 font-mono">
            {[
              "jan",
              "fev",
              "mar",
              "abr",
              "mai",
              "jun",
              "jul",
              "ago",
              "set",
              "out",
              "nov",
              "dez",
            ].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── NÚMEROS HONESTOS ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-3xl mx-auto px-6 md:px-10 pb-24 md:pb-32 text-center"
      >
        <ValoreMark size={36} className="text-[#4C8A6A]/40 mx-auto mb-8" />
        <div className="space-y-2 mb-6">
          {[
            "Sem anúncios.",
            "Sem venda de dados.",
            "Sem sincronização bancária obrigatória.",
          ].map((line, i) => (
            <motion.p
              key={line}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-display text-lg md:text-xl text-white/45"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-xl md:text-2xl font-semibold text-white/90"
        >
          Seus dados são seus.
        </motion.p>
        <div className="flex items-center justify-center gap-5 mt-6 text-white/20">
          <Lock size={15} />
          <EyeOff size={15} />
          <Shield size={15} />
        </div>
      </motion.section>

      {/* ─── CTA FINAL ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-3xl mx-auto px-6 md:px-10 pb-24 text-center"
      >
        <div
          className="rounded-3xl border border-[#4C8A6A]/15 p-12 md:p-16"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(76,138,106,0.06) 0%, transparent 70%), rgba(255,255,255,0.01)",
          }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Comece a organizar hoje
          </h2>
          <p className="text-white/45 mb-8 text-sm">
            Crie sua conta gratuitamente. Sem cartão, sem compromisso.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-all duration-200"
          >
            Criar conta grátis
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </motion.section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <ValoreLogo size={20} className="text-[#7DB99A]" />

          <nav className="flex items-center gap-6 text-sm text-white/35">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-white/70 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-white/70 transition-colors"
            >
              Criar conta
            </button>
            <a
              href="mailto:vicenzo@valore.app"
              className="hover:text-white/70 transition-colors"
            >
              Contato
            </a>
          </nav>

          <p className="text-xs text-white/20 text-center md:text-right">
            © 2026 Valore · TCC — CSTSI / IFSul
            <br />
            Orientador: Renato Marques Dilli
          </p>
        </div>
      </footer>
    </div>
  );
}
