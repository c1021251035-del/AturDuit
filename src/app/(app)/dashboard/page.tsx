"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { cn, formatRupiah } from "@/lib/utils";
import { CATEGORY_META, currentMonth, categoryTotal, totalSpent } from "@/lib/budget";
import Link from "next/link";
import type { Category } from "@/lib/types";

const cats = ["need", "want", "save"] as const;

/* ── SVG Icons (replace all emojis) ── */
function IncomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function SpentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function RemainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function CountIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

const catIconMap: Record<Category, typeof IncomeIcon> = {
  need: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  want: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  save: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const ringStrokeColor: Record<Category, string> = {
  need: "var(--ink)",
  want: "var(--mute)",
  save: "var(--success)",
};

const RING_RADIUS = 60;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_VIEWBOX = 160;

export default function DashboardPage() {
  const { state } = useStore();
  const month = state.budgetMonth || currentMonth();
  const totalIncome = state.income;
  const totalTransactions = state.transactions.length;
  const totalTerpakai = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const sisa = totalIncome - totalTerpakai;

  const hasData = totalIncome > 0;

  const kpis = [
    { label: "Pendapatan", value: formatRupiah(totalIncome), Icon: IncomeIcon, color: "var(--ink)" },
    { label: "Terpakai", value: formatRupiah(totalTerpakai), Icon: SpentIcon, color: "var(--sale)" },
    { label: "Sisa", value: formatRupiah(sisa), Icon: RemainIcon, color: sisa < 0 ? "var(--sale)" : "var(--success)" },
    { label: "Transaksi", value: `${totalTransactions}`, Icon: CountIcon, color: "var(--ink)" },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-[var(--canvas)] border border-[var(--hairline)] p-5 transition-colors hover:bg-[var(--soft-cloud)] cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-caption-sm text-[var(--ink)] font-medium uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-heading-lg font-bold tabular-nums">{hasData ? value : "—"}</p>
            </div>
          ))}
        </div>

        {/* Donut Chart — Colored Rings */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider mb-6">
            Proporsi Budget
          </h2>
          <div className="flex flex-col items-center gap-8">
            {cats.map((cat) => {
              const pct = state.ratio[cat];
              const alloc = categoryTotal(state.subCategories, cat);
              const offset = RING_CIRCUMFERENCE * (1 - pct / 100);
              return (
                <div key={cat} className="flex flex-col items-center gap-2 w-full max-w-[200px]">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <svg className="w-full h-full" viewBox={`0 0 ${RING_VIEWBOX} ${RING_VIEWBOX}`}>
                      <circle fill="none" stroke="var(--hairline-soft)" strokeWidth="10" cx="80" cy="80" r={RING_RADIUS} />
                      <circle
                        fill="none"
                        stroke={ringStrokeColor[cat]}
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="80" cy="80" r={RING_RADIUS}
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 500ms ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl md:text-3xl font-bold tabular-nums">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-caption-sm text-[var(--ink)] font-medium uppercase block">
                      {CATEGORY_META[cat].label}
                    </span>
                    <span className="text-caption-sm text-[var(--mute)] tabular-nums block">
                      {hasData ? formatRupiah(alloc) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Progress Bars */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider mb-4">
            Kategori
          </h2>
          <div className="space-y-4">
            {cats.map((cat) => {
              const alloc = categoryTotal(state.subCategories, cat);
              const spent = totalSpent(state.transactions, cat, month);
              const pct = alloc > 0 ? Math.round((spent / alloc) * 100) : 0;
              const CatIcon = catIconMap[cat];
              const catColor = cat === "need" ? "var(--ink)" : cat === "want" ? "var(--mute)" : "var(--success)";
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-body-strong">
                      <span style={{ color: catColor }}><CatIcon className="w-4 h-4" /></span>
                      {CATEGORY_META[cat].label}
                    </span>
                    <span className="text-caption-sm text-[var(--mute)] tabular-nums">
                      {hasData ? `${formatRupiah(spent)} / ${formatRupiah(alloc)}` : "—"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--hairline-soft)] rounded-nike-full overflow-hidden">
                    <div
                      className="h-full rounded-nike-full transition-all duration-300"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: catColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider">
              Transaksi Terbaru
            </h2>
            <Link href="/transactions" className="text-link-md text-[var(--ink)]">
              Lihat semua
            </Link>
          </div>
          {state.transactions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[var(--hairline)]">
              <p className="text-caption-md text-[var(--mute)] mb-3">Belum ada transaksi</p>
              <Link href="/transactions" className="btn-nike-primary inline-flex text-button-sm">
                + Tambah Transaksi
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {state.transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3 border-b border-[var(--hairline)] last:border-0">
                  <div>
                    <p className="text-body-strong">{t.note || CATEGORY_META[t.category]?.label || t.category}</p>
                    <p className="text-caption-sm text-[var(--mute)]">{t.date}</p>
                  </div>
                  <span className="text-body-strong tabular-nums text-[var(--sale)]">
                    −{formatRupiah(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
