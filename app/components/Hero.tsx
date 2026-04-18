"use client";

import { Download, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function Hero({
  onDownload,
}: {
  onDownload: (platform: string) => void;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[url('/bg.png')] bg-cover opacity-20" />
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
            New Version 1.0.1 Ready
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight text-white md:text-8xl mb-8">
          The <span className="gradient-text">Elite Ledger</span> for <br />
          Professional Freelancers
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-white/60 md:text-xl">
          Track clients, generate pixel-perfect invoices, and own your financial
          data. Local-first, private-by-design, and built for performance.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row mb-20">
          <button
            onClick={() => onDownload("Android")}
            className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-white px-10 text-xl font-black text-background transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95"
          >
            <Download className="h-6 w-6" />
            Get APK for Android
          </button>

          <button className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 text-xl font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
            <PlayCircle className="h-6 w-6" />
            Watch Demo
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto max-w-5xl animate-float">
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl opacity-50" />
          <div className="relative rounded-[2.5rem] border border-white/10 bg-[#121212] p-2">
            <Image
              src="/hero.png"
              alt="LancerPay Dashboard"
              width={1200}
              height={800}
              priority
              className="rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
