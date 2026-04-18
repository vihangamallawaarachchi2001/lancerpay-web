"use client";

import { Download, ShieldCheck, Zap, Lock } from "lucide-react";

export default function CTA({
  onDownload,
}: {
  onDownload: (platform: string) => void;
}) {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[4rem] bg-[#121212] p-12 md:p-24 border border-white/10">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(173,198,255,0.1),transparent)]" />

          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-black text-white md:text-7xl mb-10 tracking-tight">
              Ready to claim your <br />{" "}
              <span className="gradient-text">Financial Freedom</span>?
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-16">
              Download LancerPay today and experience the future of freelance
              finance. No tracking, no subscriptions, just elite precision.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row mb-20">
              <button
                onClick={() => onDownload("Android")}
                className="flex h-16 items-center justify-center gap-4 rounded-2xl bg-white px-10 text-2xl font-black text-background transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:-translate-y-2 active:scale-95"
              >
                <Download className="h-8 w-8" />
                <span>Get LancerPay APK</span>
              </button>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3 text-left">
              {[
                {
                  step: "Step 01",
                  title: "Download APK",
                  desc: "Get the signed APK instantly.",
                },
                {
                  step: "Step 02",
                  title: "Install Locally",
                  desc: "Enable unknown sources.",
                },
                {
                  step: "Step 03",
                  title: "Launch & Go",
                  desc: "Start invoicing in minutes.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <div className="text-accent text-xs font-black uppercase tracking-widest mb-3">
                    {item.step}
                  </div>
                  <div className="text-white font-bold text-xl mb-2">
                    {item.title}
                  </div>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-center gap-4 text-white/30 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" /> Verified Safe
              </div>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Privacy
                Guaranteed
              </div>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" /> Fast Setup
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
