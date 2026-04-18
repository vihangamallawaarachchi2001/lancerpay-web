"use client";

import { Globe, Share } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="glass rounded-[3rem] p-12 md:p-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="md:col-span-2">
              <div className="text-3xl font-black text-white mb-6">
                LancerPay<span className="text-accent">.</span>
              </div>
              <p className="text-white/40 max-w-xs mb-8">
                The local-first financial companion for the elite freelance
                workforce.
              </p>
              <div className="flex gap-4">
                {[Globe, Share, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-colors hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Product", links: ["Features", "Workflow", "Security"] },
              { title: "Company", links: ["About", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Audits"] },
            ].map((column, i) => (
              <div key={i}>
                <div className="text-white font-bold mb-6">{column.title}</div>
                <div className="flex flex-col gap-4">
                  {column.links.map((link, j) => (
                    <a
                      key={j}
                      href="#"
                      className="text-white/40 hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
              © 2024 LancerPay Inc. Built with obsession.
            </div>
            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-white/20 hover:text-white text-xs font-bold uppercase tracking-widest"
              >
                Status
              </a>
              <a
                href="#"
                className="text-white/20 hover:text-white text-xs font-bold uppercase tracking-widest"
              >
                Support
              </a>
              <a
                href="#"
                className="text-white/20 hover:text-white text-xs font-bold uppercase tracking-widest"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
