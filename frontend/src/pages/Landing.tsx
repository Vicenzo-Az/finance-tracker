import { ValoreLogo, ValoreMark } from "@/components/brand/Logo";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const principles = [
  {
    icon: Wallet,
    title: "Contas, sem confusão",
    desc: "Débito e crédito, separados com clareza. Cada centavo no lugar certo, sem planilhas paralelas.",
  },
  {
    icon: CreditCard,
    title: "Parcelas sob controle",
    desc: "Compras parceladas calculadas automaticamente, com cada parcela no mês certo — sem surpresas na fatura.",
  },
  {
    icon: BarChart3,
    title: "Análises que fazem sentido",
    desc: "Evolução mensal, comparativos e compromissos futuros — números que ajudam a decidir, não que confundem.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    desc: "Autenticação segura e isolamento total entre usuários. Ninguém além de você acessa suas finanças.",
  },
  {
    icon: Sparkles,
    title: "Categorização que aprende",
    desc: "O Valore lembra como você categoriza cada gasto e sugere automaticamente da próxima vez.",
  },
  {
    icon: PiggyBank,
    title: "Patrimônio real",
    desc: "Saldo de hoje e compromissos de amanhã, separados com transparência — sem números inflados.",
  },
];

function PrincipleCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      custom={index % 3}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="
        rounded-2xl border border-white/[0.06]
        bg-white/[0.02] hover:bg-white/[0.04]
        p-7 flex flex-col gap-4
        transition-colors duration-300
      "
    >
      <div className="w-10 h-10 rounded-xl bg-[#4C8A6A]/12 flex items-center justify-center">
        <Icon size={18} className="text-[#7DB99A]" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display font-semibold text-white/92 mb-1.5 text-[15px]">
          {title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#090B0A",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 max-w-6xl mx-auto"
      >
        <ValoreLogo size={24} className="text-[#7DB99A]" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/register")}
            className="
              px-4 py-2 text-sm font-medium rounded-lg
              bg-[#4C8A6A] hover:bg-[#5A9C78]
              text-[#090B0A]
              transition-colors duration-200
            "
          >
            Criar conta
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-24 md:pb-32 text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            inline-flex items-center gap-2 px-3 py-1.5 mb-8
            rounded-full border border-[#4C8A6A]/25
            bg-[#4C8A6A]/8 text-[#8FC4A6] text-xs font-medium
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7DB99A]" />
          Domine suas finanças
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display text-4xl md:text-6xl font-bold leading-[1.12] tracking-tight mb-6"
        >
          Organização financeira{" "}
          <span className="text-[#8FC4A6]">com calma.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg text-white/55 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Contas, parcelas e análises em um só lugar — sem planilhas, sem
          ansiedade. Apenas clareza sobre para onde seu dinheiro vai.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate("/register")}
            className="
              group flex items-center gap-2
              px-6 py-3 rounded-xl text-sm font-semibold
              bg-[#4C8A6A] hover:bg-[#5A9C78]
              text-[#090B0A] transition-all duration-200
            "
          >
            Começar gratuitamente
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="
              px-6 py-3 rounded-xl text-sm font-medium
              border border-white/10 hover:border-white/20
              text-white/65 hover:text-white
              transition-all duration-200
            "
          >
            Já tenho conta
          </button>
        </motion.div>
      </section>

      {/* Dashboard preview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 mb-28 md:mb-36"
      >
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          {/* Fake topbar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <ValoreMark size={14} className="text-white/30" />
            <span className="text-xs text-white/25 font-mono">
              valore-finance.vercel.app
            </span>
          </div>

          <div className="p-5 md:p-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Patrimônio",
                value: "R$ 24.830",
                color: "text-[#8FC4A6]",
              },
              { label: "Receitas", value: "R$ 8.450", color: "text-[#8FC4A6]" },
              { label: "Despesas", value: "R$ 3.120", color: "text-[#D98B7E]" },
              { label: "Saldo", value: "R$ 5.330", color: "text-[#7FAFC9]" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <p className="text-xs text-white/35 mb-1">{card.label}</p>
                <p className={`text-base md:text-lg font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="px-5 md:px-7 pb-5 md:pb-7">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 h-28 md:h-32 flex items-end gap-1.5">
              {[35, 55, 45, 70, 50, 80, 62, 40, 75, 55, 68, 88].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.035 }}
                  style={{ height: `${h}%`, originY: 1 }}
                  className="flex-1 rounded-t-sm bg-[#4C8A6A]/45"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Princípios / features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pb-28 md:pb-36">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Construído para tranquilidade, não para pressa
          </h2>
          <p className="text-white/45 max-w-md mx-auto text-sm md:text-base">
            Cada parte do Valore existe para reduzir ruído — não para adicionar
            mais um painel para checar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {principles.map((f, i) => (
            <PrincipleCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* CTA final */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pb-24 text-center"
      >
        <div className="rounded-3xl border border-[#4C8A6A]/15 bg-[#4C8A6A]/[0.04] p-12 md:p-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            Comece a organizar hoje
          </h2>
          <p className="text-white/50 mb-8 max-w-sm mx-auto text-sm md:text-base">
            Sem cartão de crédito, sem complicação. Crie sua conta e veja suas
            finanças com outros olhos.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="
              group inline-flex items-center gap-2
              px-7 py-3.5 rounded-xl font-semibold text-sm
              bg-[#4C8A6A] hover:bg-[#5A9C78]
              text-[#090B0A] transition-all duration-200
            "
          >
            Criar conta grátis
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center">
        <p className="text-xs text-white/25">
          © 2026 Valore · Desenvolvido como TCC — CSTSI / IFSul
        </p>
      </footer>
    </div>
  );
}
