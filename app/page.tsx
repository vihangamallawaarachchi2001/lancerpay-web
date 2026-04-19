"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChevronDown,
  CirclePlay,
  Database,
  Download,
  Globe,
  MessageSquareShare,
  Play,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { RELEASE, getVersionText } from "@/app/lib/release";

const faqItems = [
  {
    question: "How secure is my financial data?",
    answer:
      "LancerPay is designed around encrypted storage, secure transport, and tightly scoped access so your revenue data, client records, and invoices stay protected.",
  },
  {
    question: "Can I use this for international clients?",
    answer:
      "Yes. The experience is built around multi-currency invoicing, international client workflows, and clearer payout visibility for distributed freelance businesses.",
  },
  {
    question: "What are the payout limits?",
    answer:
      "Payout ranges vary by banking rail and region, but the release build is optimized for fast turnaround and transparent revenue tracking from invoice to settlement.",
  },
  {
    question: "Is there an enterprise API?",
    answer:
      "The product structure is API-ready, and deeper integrations can be layered on for agencies and operations teams that want automation around invoicing and reporting.",
  },
];

const comparisonRows = [
  {
    feature: "Payout Speed",
    standard: "3-7 Business Days",
    lancerpay: "Instant - 24 Hours",
    benefit: "Faster cash conversion keeps your runway healthy.",
  },
  {
    feature: "Global Compliance",
    standard: "Add-on cost",
    lancerpay: "Integrated Core",
    benefit: "Built-in operational support for global freelance work.",
  },
  {
    feature: "Invoicing Logic",
    standard: "Static Templates",
    lancerpay: "Dynamic & Smart",
    benefit: "Send cleaner, more contextual invoices with less manual work.",
  },
  {
    feature: "Platform Fee",
    standard: "2.9% + 30¢",
    lancerpay: "0.5% Flat Rate",
    benefit: "You keep more of what you earn on every payout.",
  },
];

const footerColumns = [
  {
    title: "Platform",
    links: ["Features", "Security", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
  {
    title: "Resources",
    links: ["API Docs", "Changelog"],
  },
  {
    title: "Support",
    links: ["Contact Support", "Help Center"],
  },
];

type AppVersion = {
  version: string;
  downloadUrl: string;
  notes: string;
};

export default function Page() {
  const [openFaq, setOpenFaq] = useState(0);
  const [appData, setAppData] = useState<AppVersion>({
    version: RELEASE.version,
    downloadUrl: RELEASE.apkPath,
    notes: `Current ${RELEASE.channel} release`,
  });

  useEffect(() => {
    async function fetchLatestVersion() {
      try {
        const response = await fetch("/api/app/version?platform=android");
        const data = await response.json();
        if (data.availableVersion) {
          setAppData({
            version: data.availableVersion,
            downloadUrl: data.downloadUrl,
            notes: data.notes,
          });
        }
      } catch (error) {
        console.error("Failed to fetch latest version:", error);
      }
    }
    void fetchLatestVersion();
  }, []);

  const versionLabel = `v${appData.version.replace(/^v/i, "")}`;
  const versionText = `${versionLabel} (${RELEASE.channel})`;

  const trackDownload = async (platform: string) => {
    try {
      const trackingPromise = fetch("/api/track-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform, version: appData.version }),
      });

      const link = document.createElement("a");
      link.href = appData.downloadUrl;
      // Extract filename from URL or use a fallback
      const fileName =
        appData.downloadUrl.split("/").pop() || RELEASE.apkFileName;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await trackingPromise;
    } catch (error) {
      console.error("Failed to track download:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <header className="fixed top-0 z-50 w-full bg-[#131313]/60 shadow-2xl shadow-blue-500/5 backdrop-blur-md">
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 text-sm tracking-tight md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src="/logo.png"
                alt="LancerPay logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-headline block text-xl font-bold tracking-tighter text-white">
                {RELEASE.appName}
              </span>
              <span className="font-label text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                {versionText}
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-[#C2C6D6] hover:text-white">
              Features
            </Link>
            <Link href="#workflow" className="text-[#C2C6D6] hover:text-white">
              Workflow
            </Link>
            <Link href="#compare" className="text-[#C2C6D6] hover:text-white">
              Compare
            </Link>
            <Link href="#faq" className="text-[#C2C6D6] hover:text-white">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-medium text-[#C2C6D6] hover:text-white lg:block">
              Watch Demo
            </button>
            <button
              onClick={() => trackDownload(RELEASE.platform)}
              className="rounded-md bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 font-bold text-on-primary-container active:scale-95"
            >
              Download {versionLabel}
            </button>
          </div>
        </nav>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
      </header>

      <main className="pt-20">
        <section className="hero-grid relative flex min-h-[921px] items-center overflow-hidden px-6 md:px-8">
          <div className="pointer-events-none absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-12%] bottom-[15%] h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 py-20 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="font-label text-xs uppercase tracking-[0.28em] text-on-surface-variant">
                  Release {versionLabel} Now Live
                </span>
              </div>

              <h1 className="font-headline text-5xl font-extrabold leading-[1.05] tracking-tighter text-white sm:text-6xl md:text-7xl">
                Track clients.
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Send invoices.
                </span>
                <br />
                Get paid faster.
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
                {RELEASE.appName} {versionLabel} is the high-clarity freelance
                finance workspace for faster invoicing, cleaner client tracking,
                and a stronger release-ready mobile experience.
              </p>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button
                  onClick={() => trackDownload(RELEASE.platform)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-xl shadow-primary/10 hover:brightness-110"
                >
                  Download {versionLabel}
                  <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-outline-variant/10 bg-surface-container-low px-8 py-4 text-center font-semibold text-white hover:bg-surface-container-high"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-[radial-gradient(circle_at_top,#1b2948_0%,#0f1014_55%,#090909_100%)] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/6 bg-white/4 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <Image
                        src="/logo.png"
                        alt="LancerPay logo"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-white">
                        {RELEASE.appName} Mobile
                      </p>
                      <p className="font-label text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                        Release {versionLabel}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-semibold text-secondary">
                    Ready to Install
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/30 p-3">
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent" />
                    <Image
                      src="/hero.png"
                      alt="LancerPay mobile release preview"
                      width={960}
                      height={960}
                      className="relative z-10 aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                      priority
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Production Release
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {versionText}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        Refined onboarding, polished dashboard visibility, and
                        direct APK delivery from the latest stable build.
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
                      <p className="mb-4 text-xs uppercase tracking-[0.24em] text-on-surface-variant">
                        Release Snapshot
                      </p>
                      <div className="space-y-3">
                        {[
                          `Version ${appData.version}`,
                          `${RELEASE.platform} APK`,
                          "Premium landing page refresh",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                            <span className="text-sm text-white">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => trackDownload(RELEASE.platform)}
                      className="flex items-center justify-center gap-2 rounded-[1.25rem] bg-white px-5 py-4 font-bold text-black hover:bg-on-surface"
                    >
                      <Download className="h-5 w-5" />
                      Install {versionLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-outline-variant/5 bg-surface-container-lowest/50 py-12">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <p className="mb-8 text-center font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40">
              Trusted by the world&apos;s most elite agencies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale transition-all duration-700 hover:opacity-80 hover:grayscale-0 md:gap-20">
              {["VERTEX", "NEXUS", "Quantum", "Shift.", "ORBIS"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="font-headline text-2xl font-extrabold tracking-tighter text-white"
                  >
                    {brand}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-32 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="font-headline mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Engineered for Results.
              </h2>
              <p className="mx-auto max-w-2xl text-on-surface-variant">
                Precision tools for the modern independent professional.
              </p>
            </div>

            <div className="grid auto-rows-[250px] gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 md:col-span-2 md:row-span-2">
                <div className="relative z-10 max-w-md space-y-4">
                  <div className="text-primary">
                    <BadgeCheck className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Hyper-Fast Invoicing
                  </h3>
                  <p className="text-on-surface-variant">
                    Create and send professional, high-conversion invoices in
                    under 30 seconds. Integrated with global payment rails.
                  </p>
                </div>

                <div className="absolute right-[-4%] bottom-[-8%] w-[68%] rounded-xl border border-outline-variant/10 bg-surface-container-highest p-4 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="rounded-lg bg-surface-container-lowest p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                          Invoice
                        </p>
                        <p className="text-lg font-bold text-white">INV-0428</p>
                      </div>
                      <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
                        Paid
                      </span>
                    </div>
                    <div className="space-y-3 text-sm text-on-surface-variant">
                      <div className="flex justify-between">
                        <span>UX Retainer</span>
                        <span className="text-white">$4,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Sprint</span>
                        <span className="text-white">$2,400</span>
                      </div>
                      <div className="border-t border-outline-variant/20 pt-3 text-base font-bold text-white">
                        <div className="flex justify-between">
                          <span>Total</span>
                          <span>$7,200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-outline-variant/5 bg-surface-container-low p-8">
                <BarChart3 className="h-10 w-10 text-secondary" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Live Performance
                  </h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Real-time tracking of every dollar earned and projected.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-outline-variant/5 bg-surface-container-low p-8">
                <Users className="h-10 w-10 text-tertiary" />
                <div>
                  <h3 className="text-xl font-bold text-white">Client CRM</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Centralized vault for all client data and communication
                    history.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-10 md:col-span-3">
                <div className="flex flex-col gap-12 md:flex-row md:items-center">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-bold text-white">
                      Global Compliance Integrated.
                    </h3>
                    <p className="text-on-surface-variant">
                      LancerPay automatically handles tax calculations, VAT, and
                      localized billing workflows so you can focus on delivery,
                      not admin overhead.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {["Tax Ready", "VAT Automation", "Multi-Currency"].map(
                        (item, index) => (
                          <div
                            key={item}
                            className={`rounded-full bg-surface-container-high px-4 py-2 text-xs font-medium ${
                              index === 0
                                ? "text-secondary"
                                : index === 1
                                  ? "text-primary"
                                  : "text-tertiary"
                            }`}
                          >
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-4">
                    <div className="h-24 rounded-xl bg-surface-container-low animate-pulse" />
                    <div className="h-24 rounded-xl bg-surface-container-low" />
                    <div className="h-24 rounded-xl bg-surface-container-low" />
                    <div className="h-24 rounded-xl bg-surface-container-low animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-headline mb-6 text-4xl font-bold text-white md:text-5xl">
                  See the Kinetic
                  <br />
                  Workflow in Action
                </h2>
                <p className="leading-relaxed text-on-surface-variant">
                  Experience why thousands of world-class freelancers are
                  switching to a faster, more integrated way to handle their
                  money.
                </p>
              </div>
              <button className="flex items-center gap-3 self-start rounded-full border border-outline-variant/10 bg-surface-container-high px-6 py-3 font-medium text-white hover:border-primary/40">
                <CirclePlay className="h-5 w-5" />
                Full Product Walkthrough
              </button>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-outline-variant/10 shadow-[0_0_100px_rgba(77,142,255,0.05)]">
              <Image
                src="/secure.png"
                alt="LancerPay protection and infrastructure visual"
                width={1600}
                height={900}
                className="aspect-video w-full object-cover brightness-50 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl shadow-primary/40 hover:scale-110">
                  <Play className="h-9 w-9 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="overflow-hidden px-6 py-32 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-24 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="inline-block rounded bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.2em] text-primary">
                  The Protocol
                </div>
                <div>
                  <h2 className="font-headline text-5xl font-bold leading-tight text-white">
                    Mastering Your
                    <br />
                    Capital Flow
                  </h2>
                </div>

                <div className="relative space-y-10">
                  <div className="absolute top-8 bottom-8 left-6 w-px bg-gradient-to-b from-primary/40 via-outline-variant/10 to-transparent" />

                  {[
                    {
                      step: "1",
                      active: true,
                      title: "Connect Your Talent",
                      copy: "Sync with Upwork, LinkedIn, or import your current client roster in seconds. Everything is unified.",
                    },
                    {
                      step: "2",
                      active: false,
                      title: "Automate the Ask",
                      copy: "Set smart triggers for invoicing based on milestones. No more manual follow-ups or awkward emails.",
                    },
                    {
                      step: "3",
                      active: false,
                      title: "Receive & Reinvest",
                      copy: "Get paid in your preferred currency with transfer flows built for modern freelance operations.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="relative flex gap-8">
                      <div
                        className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-surface-container-high font-bold ${
                          item.active
                            ? "border-primary/30 text-primary"
                            : "border-outline-variant/30 text-on-surface-variant"
                        }`}
                      >
                        {item.step}
                      </div>
                      <div>
                        <h4 className="mb-2 text-xl font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="text-on-surface-variant">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-[100px]" />
                <div className="relative z-10 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low p-3">
                  <Image
                    src="/logo.png"
                    alt="LancerPay branded emblem"
                    width={1000}
                    height={1200}
                    className="w-full max-w-xl rounded-[1.25rem] object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="bg-surface-container-lowest py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-label text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">
                  Why {RELEASE.appName} {versionLabel} feels better
                </span>
              </div>
              <h2 className="font-headline mb-4 text-3xl font-bold text-white md:text-4xl">
                Old World vs. {RELEASE.appName} {versionLabel}
              </h2>
              <p className="mx-auto max-w-2xl text-on-surface-variant">
                A more polished release experience should look sharper here too,
                so the comparison is now easier to scan and much more clearly in
                favor of the app.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-outline-variant/10 bg-[linear-gradient(180deg,rgba(53,53,52,0.9)_0%,rgba(28,27,27,0.95)_100%)] p-8">
                <p className="font-label mb-6 text-xs uppercase tracking-[0.28em] text-on-surface-variant">
                  Release Advantage
                </p>
                <div className="space-y-5">
                  {comparisonRows.map((row) => (
                    <div
                      key={row.feature}
                      className="rounded-2xl border border-white/6 bg-black/15 p-5"
                    >
                      <p className="text-sm font-semibold text-white">
                        {row.feature}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                        {row.benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(36,42,54,0.92)_0%,rgba(23,24,28,0.98)_100%)] shadow-[0_0_100px_rgba(77,142,255,0.07)]">
                <div className="grid grid-cols-3 border-b border-outline-variant/10 bg-white/[0.04] px-8 py-6">
                  <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant/50">
                    Feature
                  </div>
                  <div className="text-center font-label text-xs uppercase tracking-widest text-on-surface-variant/50">
                    Standard Tools
                  </div>
                  <div className="text-center font-label text-xs uppercase tracking-widest text-primary">
                    {RELEASE.appName}
                  </div>
                </div>

                {comparisonRows.map((row, index) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-1 gap-4 px-8 py-7 md:grid-cols-3 md:items-center ${
                      index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                    }`}
                  >
                    <div className="text-sm font-medium text-white">
                      {row.feature}
                    </div>
                    <div className="text-sm text-on-surface-variant md:text-center">
                      {row.standard}
                    </div>
                    <div className="md:flex md:justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-sm font-bold text-secondary">
                        <span className="h-2 w-2 rounded-full bg-secondary" />
                        {row.lancerpay}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-32 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-gradient-to-br from-surface-container-low to-surface-container-lowest p-12 md:p-24">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 blur-[120px]" />

              <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="font-headline mb-8 text-4xl font-bold text-white md:text-5xl">
                    Deploy Anywhere.
                    <br />
                    Manage Everywhere.
                  </h2>
                  <p className="mb-12 text-xl leading-relaxed text-on-surface-variant">
                    Download the {RELEASE.appName} native app for
                    enterprise-grade security and mobile-first performance. This
                    page now points directly to the real {RELEASE.versionLabel}{" "}
                    APK release.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container">
                        <Download className="h-4 w-4 text-on-secondary-container" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Download APK
                        </h4>
                        <p className="text-sm text-on-surface-variant">
                          Version {appData.version} ({RELEASE.channel}).
                          Production-ready Android build linked directly from
                          the public release file.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-high">
                        <Smartphone className="h-4 w-4 text-on-surface-variant" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Installation Guide
                        </h4>
                        <p className="text-sm text-on-surface-variant">
                          Enable unknown sources in Android security settings to
                          sideload the release APK safely.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-wrap gap-4">
                    <button
                      onClick={() => trackDownload(RELEASE.platform)}
                      className="flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-black hover:bg-on-surface"
                    >
                      <Download className="h-5 w-5" />
                      Download {versionLabel}
                    </button>
                    <button className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-high px-8 py-4 font-bold text-white hover:border-primary/40">
                      <MessageSquareShare className="h-5 w-5" />
                      Get Link via SMS
                    </button>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div className="rounded-[1.75rem] bg-white p-5 shadow-2xl shadow-primary/20 transition-transform duration-500 hover:rotate-0 lg:rotate-3">
                    <div className="overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,#111_0%,#2d2d2d_100%)]">
                      <Image
                        src="/LancerPayQR.png"
                        alt={`QR code for downloading ${RELEASE.appName} ${RELEASE.versionLabel}`}
                        width={320}
                        height={320}
                        className="h-48 w-48 object-cover md:h-64 md:w-64"
                      />
                    </div>
                    <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-black">
                      Scan to Install {versionLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-surface px-6 py-32 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-20 text-center">
              <h2 className="font-headline text-4xl font-bold tracking-tight text-white">
                Intelligence Briefing
              </h2>
              <p className="mt-4 text-on-surface-variant">
                Common questions about the {RELEASE.appName} {versionLabel}{" "}
                release.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = index === openFaq;

                return (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-outline-variant/5 bg-surface-container-low p-6"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq((current) =>
                          current === index ? -1 : index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="text-lg font-bold text-white">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform ${
                          isOpen
                            ? "rotate-180 text-primary"
                            : "text-on-surface-variant"
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                        {item.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center md:p-24">
            <div className="relative z-10">
              <h2 className="font-headline mx-auto mb-8 max-w-3xl text-5xl font-extrabold leading-none tracking-tighter text-on-primary-container md:text-6xl">
                Ready to upgrade your financial stack?
              </h2>
              <p className="mb-12 text-xl text-on-primary opacity-90">
                Join thousands of freelancers on {RELEASE.appName}{" "}
                {versionLabel}.
              </p>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <button
                  onClick={() => trackDownload(RELEASE.platform)}
                  className="rounded-2xl bg-on-primary-container px-12 py-5 text-lg font-bold text-primary shadow-2xl hover:scale-105"
                >
                  Download {RELEASE.versionLabel}
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-2xl border-2 border-on-primary-container/20 px-12 py-5 text-lg font-bold text-on-primary-container hover:bg-on-primary-container/5"
                >
                  View Live Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-32 w-full border-t border-outline-variant/10 bg-[#0E0E0E] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <div className="mb-12 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/10">
                  <Image
                    src="/logo.png"
                    alt="LancerPay logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-headline text-lg font-black uppercase tracking-tighter text-white">
                    {RELEASE.appName}
                  </span>
                  <p className="font-label text-[10px] uppercase tracking-[0.24em] text-[#C2C6D6]/50">
                    {getVersionText()}
                  </p>
                </div>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-[#C2C6D6]/60">
                The standard for freelance financial infrastructure. High
                performance, zero compromise.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-6">
                <h5 className="text-xs font-black uppercase tracking-widest text-white">
                  {column.title}
                </h5>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs font-medium text-[#C2C6D6]/60 transition-all hover:text-[#14B8A6]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-12 h-px w-full bg-[#1C1B1B] opacity-10" />

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-xs uppercase tracking-widest text-[#C2C6D6]/40 italic">
              © 2026 {RELEASE.appName}. Release {RELEASE.versionLabel}.
            </p>
            <div className="flex gap-8">
              {[Globe, MessageSquareShare, Database].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-[#C2C6D6]/40 transition-colors hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
