import { ValoreLogo, ValoreMark } from "@/components/brand/Logo";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CreditCard,
  EyeOff,
  Lock,
  ShieldOff,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
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
    desc: "Veja para onde seu dinheiro vai mês a mês, por categoria, por conta — sem precisar somar nada na mão.",
  },
  {
    number: "03",
    title: "Planeje",
    desc: "Compromissos futuros e parcelas já calculados, para decidir com o que está por vir — não só com o que já passou.",
  },
];

const honestPoints = [
  "Sem anúncios.",
  "Sem venda de dados.",
  "Sem sincronização bancária obrigatória.",
];

const installments = [
  { n: 1, paid: true },
  { n: 2, paid: true },
  { n: 3, paid: false },
  { n: 4, paid: false },
  { n: 5, paid: false },
  { n: 6, paid: false },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-[#F2F4F0] overflow-x-hidden"
      style={{
        background:
          "radial-gradient(60% 50% at 18% 0%, rgba(76,138,106,0.10) 0%, transparent 70%), radial-gradient(50% 40% at 88% 12%, rgba(199,163,90,0.06) 0%, transparent 70%), #090B0A",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 max-w-5xl mx-auto"
      >
        <ValoreLogo size={24} className="text-[#7DB99A]" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white/55 hover:text-white transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-colors duration-200"
          >
            Criar conta
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display font-bold tracking-tight leading-[1.08] text-4xl md:text-6xl mb-6 max-w-2xl"
        >
          <span className="text-white">Organize suas finanças.</span>
          <br />
          <span className="text-white/45">Sem transformar sua vida</span>
          <br />
          <span className="text-white/45">em uma planilha.</span>
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg text-white/50 max-w-md mb-9 leading-relaxed"
        >
          Contas, parcelas e análises em um só lugar — pensado para quem
          quer entender o próprio dinheiro, não estudar uma planilha.
        </motion.p>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <button
            onClick={() => navigate("/register")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-all duration-200"
          >
            Começar gratuitamente
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Cards flutuantes — produto real */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-28 md:pb-36"
      >
        <div className="relative h-[280px] md:h-[320px]">
          {/* Patrimônio líquido */}
          <div
            className="absolute left-0 top-0 w-[230px] md:w-[260px] rounded-2xl border border-white/[0.08] bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ transform: "rotate(-3deg)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/40">
              <Wallet size={14} />
              <span className="text-xs">Patrimônio líquido</span>
            </div>
            <p className="text-2xl font-display font-bold text-[#8FC4A6]">R$ 24.830</p>
            <p className="text-xs text-white/35 mt-1">+8,3% nos últimos 30 dias</p>
          </div>

          {/* Compra parcelada */}
          <div
            className="absolute right-0 top-6 md:top-10 w-[230px] md:w-[260px] rounded-2xl border border-white/[0.08] bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ transform: "rotate(2.5deg)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/40">
              <CreditCard size={14} />
              <span className="text-xs">Compra parcelada</span>
            </div>
            <p className="text-sm font-medium text-white/85 mb-3">Notebook — 6x R$ 500</p>
            <div className="flex gap-1">
              {installments.map((inst) => (
                <span
                  key={inst.n}
                  className={`flex-1 h-1.5 rounded-full ${
                    inst.paid ? "bg-[#4C8A6A]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/35 mt-2">2 de 6 parcelas pagas</p>
          </div>

          {/* Compromissos futuros */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[230px] md:w-[260px] rounded-2xl border border-white/[0.08] bg-[#0F1612] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ transform: "rotate(-1deg)" }}
          >
            <div className="flex items-center gap-2 mb-3 text-white/40">
              <CalendarClock size={14} />
              <span className="text-xs">Compromissos futuros</span>
            </div>
            <p className="text-2xl font-display font-bold text-[#D9B36A]">R$ 2.000</p>
            <p className="text-xs text-white/35 mt-1">em 4 parcelas pendentes</p>
          </div>
        </div>
      </motion.section>

      {/* Declaração editorial */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 py-28 md:py-36 text-center"
      >
        <span className="text-xs text-[#8FC4A6]/70 tracking-widest uppercase mb-6 block">
          Filosofia
        </span>
        <p className="font-display text-2xl md:text-4xl font-semibold leading-snug text-white/90">
          Clareza é saber onde você está,
          <br />
          antes de decidir para onde vai.
        </p>
      </motion.section>

      {/* Como funciona */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-28 md:pb-36">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl md:text-3xl font-bold mb-14 tracking-tight"
        >
          Como o Valore funciona
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <span className="font-mono text-sm text-[#D9B36A]/70 block mb-3">
                {step.number}
              </span>
              <h3 className="font-display font-semibold text-lg text-white/90 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Parcelamentos — diferencial */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-28 md:pb-36"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="text-xs text-[#8FC4A6]/70 tracking-widest uppercase mb-5 block">
              Cartão de crédito
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-5 tracking-tight">
              Cada parcela.
              <br />
              Cada vencimento.
              <br />
              <span className="text-white/45">Sem surpresas na fatura.</span>
            </h2>
            <p className="text-sm md:text-base text-white/50 leading-relaxed">
              Compras parceladas se distribuem automaticamente pelos meses
              certos. Você sabe exatamente o que falta pagar — e quando.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0F1612] p-6">
            <p className="text-sm font-medium text-white/85 mb-1">iPhone 16</p>
            <p className="text-xs text-white/35 mb-5">12x de R$ 500,00</p>
            <div className="space-y-2.5">
              {installments.map((inst) => (
                <div key={inst.n} className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      inst.paid
                        ? "bg-[#4C8A6A] text-[#090B0A]"
                        : "border border-white/15 text-white/35"
                    }`}
                  >
                    {inst.n}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inst.paid ? "bg-[#4C8A6A]" : "bg-transparent"
                      }`}
                      style={{ width: inst.paid ? "100%" : "0%" }}
                    />
                  </div>
                  <span className="text-xs text-white/35 font-mono w-16 text-right">
                    {inst.paid ? "pago" : "pendente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Análises financeiras */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-28 md:pb-36"
      >
        <div className="text-center mb-12">
          <span className="text-xs text-[#8FC4A6]/70 tracking-widest uppercase mb-5 block">
            Análises
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight max-w-lg mx-auto">
            Números que ajudam a decidir, não que confundem
          </h2>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0F1612] p-6 md:p-8">
          <p className="text-xs text-white/35 mb-5">Evolução mensal</p>
          <div className="h-32 md:h-40 flex items-end gap-1.5 mb-2">
            {[35, 50, 42, 65, 48, 75, 58, 38, 70, 52, 64, 85].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                style={{ height: `${h}%`, originY: 1 }}
                className="flex-1 rounded-t-sm bg-[#4C8A6A]/45"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-white/25 font-mono">
            <span>jan</span>
            <span>jun</span>
            <span>dez</span>
          </div>
        </div>
      </motion.section>

      {/* Números honestos */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-6 md:px-8 pb-28 md:pb-36 text-center"
      >
        <div className="space-y-3 mb-3">
          {honestPoints.map((point) => (
            <p key={point} className="text-lg md:text-xl text-white/55 font-display">
              {point}
            </p>
          ))}
        </div>
        <p className="text-lg md:text-xl font-display font-semibold text-white/90 mt-6">
          Seus dados são seus.
        </p>

        <div className="flex items-center justify-center gap-6 mt-8 text-white/30">
          <Lock size={16} />
          <EyeOff size={16} />
          <ShieldOff size={16} />
        </div>
      </motion.section>

      {/* CTA final */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 pb-24 text-center"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 tracking-tight">
          Comece a organizar hoje
        </h2>
        <button
          onClick={() => navigate("/register")}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#4C8A6A] hover:bg-[#5A9C78] text-[#090B0A] transition-all duration-200"
        >
          Começar gratuitamente
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 text-white/25">
          <ValoreMark size={14} />
          <span className="text-xs">valore</span>
        </div>
        <p className="text-xs text-white/25">
          © 2026 Valore · Desenvolvido como TCC — CSTSI / IFSul
        </p>
      </footer>
    </div>
  );
}