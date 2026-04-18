"use client";

import {
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Client Management",
    desc: "A powerful, private CRM to manage your relationships without third-party data collection.",
    grid: "md:col-span-4",
    bg: "bg-surface-card",
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Invoice Engine",
    desc: "Generate professional PDF invoices with multi-currency support in seconds.",
    grid: "md:col-span-2",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-secondary" />,
    title: "Privacy First",
    desc: "Your data never leaves your device. No cloud, no tracking, just security.",
    grid: "md:col-span-2",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Cashflow Insights",
    desc: "Visualize your revenue peaks and growth with automated, local reporting.",
    grid: "md:col-span-4",
    children: (
      <div className="mt-8 flex items-end justify-between gap-2 h-32 w-full max-w-xs">
        <div className="h-1/2 w-full rounded-t-lg bg-accent/20 animate-pulse" />
        <div className="h-3/4 w-full rounded-t-lg bg-accent/40 animate-pulse [animation-delay:200ms]" />
        <div className="h-full w-full rounded-t-lg bg-accent shadow-[0_0_20px_rgba(79,219,200,0.5)]" />
        <div className="h-2/3 w-full rounded-t-lg bg-accent/60 animate-pulse [animation-delay:400ms]" />
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-black text-white md:text-6xl mb-6">
            Built for the <span className="gradient-text">Unstoppable</span>.
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            LancerPay focuses on what matters: your cash flow, your privacy, and
            your time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:grid-rows-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group flex flex-col justify-between overflow-hidden rounded-[2.5rem] glass-card p-10 transition-all hover:bg-white/[0.05] hover:border-white/20 ${feature.grid}`}
            >
              <div>
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-transform group-hover:scale-110 group-hover:bg-white/10">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-3xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed text-white/60">
                  {feature.desc}
                </p>
              </div>
              {feature.children}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
