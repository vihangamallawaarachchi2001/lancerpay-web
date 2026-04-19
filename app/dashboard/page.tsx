"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { RELEASE, getVersionText } from "@/app/lib/release";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Download,
  FileText,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  Users,
  LogOut,
  Plus,
  Save,
  CheckCircle2,
} from "lucide-react";
import { adminAuth } from "@/app/lib/admin";

type ActivityRow = {
  id?: string | number;
  platform: string | null;
  app_version: string | null;
  created_at: string;
  clients_count: number | null;
  projects_count: number | null;
  invoices_count: number | null;
  event: string | null;
  has_business_profile: boolean | null;
};

type DashboardStats = {
  totalDownloads: number;
  totalActivity: number;
  latestVersion: string;
  activeClients: number;
  totalInvoices: number;
  totalProjects: number;
  businessProfiles: number;
};

const numberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const defaultStats: DashboardStats = {
  totalDownloads: 0,
  totalActivity: 0,
  latestVersion: RELEASE.versionLabel,
  activeClients: 0,
  totalInvoices: 0,
  totalProjects: 0,
  businessProfiles: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [customDownloadUrl, setCustomDownloadUrl] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const loggedIn = adminAuth.isLoggedIn();
    setIsAuthenticated(loggedIn);
    if (loggedIn) {
      void fetchStats();
    }
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
            "id, platform, app_version, created_at, clients_count, invoices_count, projects_count, event, has_business_profile",
          )
          .order("created_at", { ascending: false })
          .limit(10),
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
        totalProjects: activityRows.reduce(
          (accumulator, current) => accumulator + (current.projects_count ?? 0),
          0,
        ),
        businessProfiles: activityRows.filter((a) => a.has_business_profile)
          .length,
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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const success = adminAuth.login(username, password);
    if (success) {
      setIsAuthenticated(true);
      void fetchStats();
    } else {
      setLoginError("Invalid admin credentials");
    }
  }

  function handleLogout() {
    adminAuth.logout();
    setIsAuthenticated(false);
    setStats(defaultStats);
    setRecentActivity([]);
  }

  async function handleUpdateVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!newVersion) return;

    setIsUpdatingVersion(true);
    setErrorMessage(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch("/api/admin/update-version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: newVersion,
          notes: versionNotes,
          platform: RELEASE.platform,
          download_url: customDownloadUrl || RELEASE.apkPath,
          is_active: true,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update version");
      }

      setUpdateSuccess(true);
      setNewVersion("");
      setVersionNotes("");
      setCustomDownloadUrl("");
      void fetchStats();

      // Reset success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to update version:", error);
      setErrorMessage(
        error.message || "Failed to update app version in Supabase.",
      );
    } finally {
      setIsUpdatingVersion(false);
    }
  }

  const statsCards = [
    {
      label: "Total App Downloads",
      value: numberFormatter.format(stats.totalDownloads),
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
      value: numberFormatter.format(stats.totalActivity),
      helper: "Recent telemetry records",
      icon: <Activity className="h-5 w-5 text-tertiary" />,
      border: "border-tertiary/20",
    },
    {
      label: "Tracked Invoices",
      value: numberFormatter.format(stats.totalInvoices),
      helper: `${numberFormatter.format(stats.totalProjects)} project mappings`,
      icon: <FileText className="h-5 w-5 text-primary" />,
      border: "border-primary/20",
    },
    {
      label: "Business Ready",
      value: `${stats.businessProfiles}`,
      helper: "Profiles with business setup",
      icon: <BadgeCheck className="h-5 w-5 text-accent" />,
      border: "border-accent/20",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] p-6 text-white overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(173,198,255,0.08),transparent)]" />

        <div className="glass-card w-full max-w-md rounded-[2.5rem] border border-white/10 p-10 shadow-2xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 relative h-20 w-20 overflow-hidden rounded-[2rem] ring-2 ring-white/10">
              <Image
                src="/logo.png"
                alt="LancerPay logo"
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Admin Portal</h1>
            <p className="mt-2 text-sm font-medium text-white/40">
              Please sign in to access the control panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/40">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/40">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p className="text-center text-xs font-bold text-red-400">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-primary to-primary-container py-4 text-sm font-black text-on-primary-container transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <Link
            href="/"
            className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-white/30 transition-colors hover:text-white/60"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-200 transition-all hover:bg-red-500/20 active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              Logout
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
                  Channel:{" "}
                  <span className="font-semibold text-white">
                    {RELEASE.channel}
                  </span>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                  APK:{" "}
                  <span className="font-semibold text-white">
                    {RELEASE.apkFileName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/8 p-8">
            <p className="font-label text-xs uppercase tracking-[0.28em] text-white/35">
              Update Version
            </p>
            <form onSubmit={handleUpdateVersion} className="mt-6 space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="e.g. 1.2.2"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isUpdatingVersion}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary-container transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {isUpdatingVersion ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : updateSuccess ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {updateSuccess ? "Updated" : "New Release"}
                </button>
              </div>
              <input
                type="text"
                value={customDownloadUrl}
                onChange={(e) => setCustomDownloadUrl(e.target.value)}
                placeholder={`Download URL (Default: ${RELEASE.apkPath})`}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
              />
              <textarea
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Release notes (optional)"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none h-20 resize-none"
              />
            </form>
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
                  {numberFormatter.format(stats.totalDownloads)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                  Clients
                </p>
                <p className="mt-3 text-2xl font-black text-white">
                  {numberFormatter.format(stats.activeClients)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                  Invoices
                </p>
                <p className="mt-3 text-2xl font-black text-white">
                  {numberFormatter.format(stats.totalInvoices)}
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
                          {activity.event || "User Activity"}
                          <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] font-black uppercase text-white/30">
                            {activity.platform ?? RELEASE.platform}
                          </span>
                          {activity.has_business_profile && (
                            <span className="rounded-full bg-accent/20 border border-accent/20 px-1.5 py-0.5 text-[10px] font-black uppercase text-accent">
                              Business Profile
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-white/40">
                          Version{" "}
                          {activity.app_version
                            ? `v${activity.app_version.replace(/^v/i, "")}`
                            : RELEASE.versionLabel}{" "}
                          •{" "}
                          {dateFormatter.format(new Date(activity.created_at))}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-accent/80">
                          <span>{activity.clients_count ?? 0} Clients</span>
                          <span className="text-white/20">•</span>
                          <span>{activity.projects_count ?? 0} Projects</span>
                          <span className="text-white/20">•</span>
                          <span>{activity.invoices_count ?? 0} Invoices</span>
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
