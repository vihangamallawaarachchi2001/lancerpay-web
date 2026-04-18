"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { RELEASE, getVersionText } from "@/app/lib/release";
import {
  Activity,
  ArrowLeft,
  Download,
  FileText,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";

type ActivityRow = {
  id?: string | number;
  platform: string | null;
  app_version: string | null;
  created_at: string;
  clients_count: number | null;
  invoices_count: number | null;
};

type DashboardStats = {
  totalDownloads: number;
  totalActivity: number;
  latestVersion: string;
  activeClients: number;
  totalInvoices: number;
};

const defaultStats: DashboardStats = {
  totalDownloads: 0,
  totalActivity: 0,
  latestVersion: RELEASE.versionLabel,
  activeClients: 0,
  totalInvoices: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [downloads, activity, versions, activityData] = await Promise.all([
        supabase.from("downloads").select("*", { count: "exact", head: true }),
        supabase
          .from("app_activity")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("app_versions")
          .select("version")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1),
        supabase
          .from("app_activity")
          .select(
            "id, platform, app_version, created_at, clients_count, invoices_count",
          )
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (downloads.error) {
        throw downloads.error;
      }

      if (activity.error) {
        throw activity.error;
      }

      if (versions.error) {
        throw versions.error;
      }

      if (activityData.error) {
        throw activityData.error;
      }

      const activityRows = activityData.data ?? [];

      setStats({
        totalDownloads: downloads.count ?? 0,
        totalActivity: activity.count ?? 0,
        latestVersion: versions.data?.[0]?.version
          ? `v${versions.data[0].version.replace(/^v/i, "")}`
          : RELEASE.versionLabel,
        activeClients: activityRows.reduce(
          (accumulator, current) => accumulator + (current.clients_count ?? 0),
          0,
        ),
        totalInvoices: activityRows.reduce(
          (accumulator, current) => accumulator + (current.invoices_count ?? 0),
          0,
        ),
      });
      setRecentActivity(activityRows);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setErrorMessage(
        "Dashboard data could not be loaded from Supabase right now. The release metadata shown below is still accurate.",
      );
      setStats(defaultStats);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }

  const statsCards = [
    {
      label: "Total App Downloads",
      value: stats.totalDownloads.toLocaleString(),
      helper: `APK: ${RELEASE.apkFileName}`,
      icon: <Download className="h-5 w-5 text-primary" />,
      border: "border-primary/20",
    },
    {
      label: "Latest Version",
      value: stats.latestVersion,
      helper: getVersionText(),
      icon: <Smartphone className="h-5 w-5 text-secondary" />,
      border: "border-secondary/20",
    },
    {
      label: "Activity Reports",
      value: stats.totalActivity.toLocaleString(),
      helper: "Recent telemetry records",
      icon: <Activity className="h-5 w-5 text-tertiary" />,
      border: "border-tertiary/20",
    },
    {
      label: "Tracked Invoices",
      value: stats.totalInvoices.toLocaleString(),
      helper: `${stats.activeClients.toLocaleString()} active client records`,
      icon: <FileText className="h-5 w-5 text-primary" />,
      border: "border-primary/20",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] p-6 text-white md:p-12">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(173,198,255,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="glass flex h-12 w-12 items-center justify-center rounded-xl transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="LancerPay logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight">
                  <LayoutDashboard className="text-primary" />
                  {RELEASE.appName}
                  <span className="text-xl font-medium tracking-normal text-primary/70">
                    Monitor
                  </span>
                </h1>
                <p className="text-sm font-medium text-white/40">
                  Release dashboard for {getVersionText()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={RELEASE.apkPath}
              download={RELEASE.apkFileName}
              className="rounded-xl bg-gradient-to-r from-primary to-primary-container px-5 py-3 text-sm font-bold text-on-primary-container transition-all hover:brightness-110"
            >
              Download {RELEASE.versionLabel}
            </a>
            <button
              onClick={() => void fetchStats()}
              disabled={loading}
              className="glass flex items-center gap-3 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </header>

        {errorMessage ? (
          <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/8 p-5 text-sm text-amber-100">
            {errorMessage}
          </div>
        ) : null}

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card rounded-[2rem] border border-white/8 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-label text-xs uppercase tracking-[0.28em] text-white/35">
                  Production Release
                </p>
                <h2 className="mt-3 font-headline text-4xl font-extrabold tracking-tight text-white">
                  {RELEASE.appName} {RELEASE.versionLabel}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
                  This release view now shares the same canonical APK filename,
                  version label, and brand assets as the landing page so the
                  launch surface stays consistent.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-white/75">
                <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                  Channel: <span className="font-semibold text-white">{RELEASE.channel}</span>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                  APK: <span className="font-semibold text-white">{RELEASE.apkFileName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/8 p-8">
            <p className="font-label text-xs uppercase tracking-[0.28em] text-white/35">
              Release Health
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Landing page aligned to release metadata",
                "Dashboard and API defaults aligned to current version",
                "Direct APK downloads enabled from public assets",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/4 px-4 py-3"
                >
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className={`glass-card rounded-[2rem] border border-white/8 border-l-4 p-8 ${stat.border}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="glass rounded-xl p-3">{stat.icon}</div>
              </div>
              <div className="mb-1 text-3xl font-black">{stat.value}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/55">
                {stat.label}
              </div>
              <div className="mt-3 text-xs text-white/35">{stat.helper}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="glass-card rounded-[3rem] p-10 lg:col-span-2">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <Activity className="h-6 w-6 text-accent" />
              Growth Activity
            </h2>

            <div className="grid grid-cols-7 items-end gap-4">
              {[44, 62, 51, 78, 69, 88, 100].map((height, index) => (
                <div key={height} className="flex flex-col items-center gap-4">
                  <div
                    className="relative w-full rounded-2xl bg-gradient-to-t from-accent/8 to-accent/40"
                    style={{ height: `${height * 2.4}px` }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-accent blur-xl opacity-0 transition-opacity hover:opacity-20" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tighter text-white/20">
                    D{index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                  Downloads
                </p>
                <p className="mt-3 text-2xl font-black text-white">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                  Clients
                </p>
                <p className="mt-3 text-2xl font-black text-white">
                  {stats.activeClients.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                  Invoices
                </p>
                <p className="mt-3 text-2xl font-black text-white">
                  {stats.totalInvoices.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mt-10 text-center text-sm font-medium italic text-white/30">
              &ldquo;Privacy is a feature, not a burden. All metrics here are
              operational pulse checks for the release.&rdquo;
            </p>
          </div>

          <div className="glass-card rounded-[3rem] p-10">
            <h2 className="mb-8 text-xl font-black">Recent Pulse</h2>
            <div className="space-y-5">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={activity.id ?? `${activity.created_at}-${index}`}
                    className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <Users className="h-4 w-4 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                          New Report
                          <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] font-black uppercase text-white/30">
                            {activity.platform ?? RELEASE.platform}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-white/40">
                          Version{" "}
                          {activity.app_version
                            ? `v${activity.app_version.replace(/^v/i, "")}`
                            : RELEASE.versionLabel}{" "}
                          • {new Date(activity.created_at).toLocaleDateString()}
                        </div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-accent">
                          {activity.clients_count ?? 0} Clients •{" "}
                          {activity.invoices_count ?? 0} Invoices
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-30">
                  <ShieldAlert className="mx-auto mb-4 h-12 w-12" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    No activity reported yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
