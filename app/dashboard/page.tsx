"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  Activity,
  Download,
  Smartphone,
  Users,
  FileText,
  ArrowLeft,
  RefreshCw,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalActivity: 0,
    latestVersion: "v0.0.0",
    activeClients: 0,
    totalInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const [downloads, activity, versions] = await Promise.all([
        supabase.from("downloads").select("*", { count: "exact" }),
        supabase.from("app_activity").select("*", { count: "exact" }),
        supabase
          .from("app_versions")
          .select("version")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      const activityData = await supabase
        .from("app_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalDownloads: downloads.count || 0,
        totalActivity: activity.count || 0,
        latestVersion: versions.data?.[0]?.version || "Unknown",
        activeClients:
          activity.data?.reduce(
            (acc: number, curr: any) => acc + (curr.clients_count || 0),
            0,
          ) || 0,
        totalInvoices:
          activity.data?.reduce(
            (acc: number, curr: any) => acc + (curr.invoices_count || 0),
            0,
          ) || 0,
      });
      setRecentActivity(activityData.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-12 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(173,198,255,0.05),transparent)]" />

      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="glass h-12 w-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <LayoutDashboard className="text-accent" />
                LancerPay{" "}
                <span className="text-primary font-medium tracking-normal text-xl opacity-60">
                  Monitor
                </span>
              </h1>
              <p className="text-white/40 text-sm font-medium">
                Real-time health & growth metrics
              </p>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="glass px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-bold hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total App Downloads",
              value: stats.totalDownloads,
              icon: <Download className="text-primary" />,
              color: "border-primary/20",
            },
            {
              label: "Latest Version",
              value: stats.latestVersion,
              icon: <Smartphone className="text-accent" />,
              color: "border-accent/20",
            },
            {
              label: "Active Reports",
              value: stats.totalActivity,
              icon: <Activity className="text-secondary" />,
              color: "border-secondary/20",
            },
            {
              label: "Freelancer Invoices",
              value: stats.totalInvoices.toLocaleString(),
              icon: <FileText className="text-primary" />,
              color: "border-primary/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`glass-card p-8 rounded-[2rem] border-l-4 ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="glass p-3 rounded-xl">{stat.icon}</div>
              </div>
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm font-bold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area (Placeholder) */}
          <div className="lg:col-span-2 glass-card p-10 rounded-[3rem]">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Activity className="text-accent h-6 w-6" /> Growth Activity
            </h2>
            <div className="h-[300px] w-full flex items-end justify-between gap-4">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-4"
                >
                  <div
                    className="w-full rounded-2xl bg-gradient-to-t from-accent/5 to-accent/40 relative group"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute inset-0 bg-accent blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <span className="text-white/20 text-xs font-bold uppercase tracking-tighter">
                    Day {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-12 text-white/30 text-center text-sm font-medium italic">
              "Privacy is a feature, not a burden. All metrics are anonymous
              pulse checks."
            </p>
          </div>

          {/* Right Sidebar - Recent Activity */}
          <div className="glass-card p-10 rounded-[3rem]">
            <h2 className="text-xl font-black mb-8">Recent Pulse</h2>
            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((act, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="glass h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-accent/10">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        New Report{" "}
                        <span className="text-[10px] text-white/30 px-1.5 py-0.5 border border-white/10 rounded-full font-black uppercase">
                          {act.platform}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        Version {act.app_version} •{" "}
                        {new Date(act.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-accent font-black uppercase tracking-widest mt-2">
                        {act.clients_count} Clients • {act.invoices_count}{" "}
                        Invoices
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-20">
                  <ShieldAlert className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    No activity reported yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
