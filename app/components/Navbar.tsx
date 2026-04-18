"use client";

import Link from "next/link";
import { Download } from "lucide-react";

export default function Navbar({
  onDownload,
}: {
  onDownload: (platform: string) => void;
}) {
  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4">
      <div className="mx-auto max-w-7xl">
        <nav className="glass rounded-2xl flex h-16 items-center justify-between px-8">
          <div className="text-2xl font-black tracking-tighter text-white">
            LancerPay<span className="text-accent">.</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Workflow
            </Link>
            <Link
              href="#compare"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Compare
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onDownload("Android")}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-bold text-[#00285d] transition-all hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download App</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
