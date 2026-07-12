"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { cn, formatRupiah, formatMonth } from "@/lib/utils";
import { CATEGORY_META, currentMonth, categoryTotal, totalSpent } from "@/lib/budget";
import type { Category } from "@/lib/types";

const cats = ["need", "want", "save"] as const;

/* ── SVG Insight Icons ── */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function WarnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function DangerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

const ringStrokeColor: Record<Category, string> = {
  need: "var(--ink)",
  want: "var(--ink)",
  save: "var(--ink)",
};

const ANALYTICS_RING_RADIUS = 60;
const ANALYTICS_RING_CIRCUMFERENCE = 2 * Math.PI * ANALYTICS_RING_RADIUS;
const ANALYTICS_RING_VIEWBOX = 160;
const ringWidthAnalytics: Record<Category, number> = {
  need: 4,
  want: 3,
  save: 2,
};

export default function AnalyticsPage() {
  const { state } = useStore();
  const month = state.budgetMonth || currentMonth();
  const monthLabel = formatMonth(month);
  const totalIncome = state.income;
  const totalSpentAmount = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpentAmount) / totalIncome) * 100 : 0;

  const savingsCircumference = 2 * Math.PI * 54;
  const savingsOffset = savingsCircumference * (1 - Math.min(savingsRate, 100) / 100);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-heading-xl font-bold">Analitik</h1>
            <p className="text-caption-md text-[var(--mute)] mt-1">{monthLabel}</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)]">
          <div className="p-6 flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full" viewBox={`0 0 ${ANALYTICS_RING_VIEWBOX} ${ANALYTICS_RING_VIEWBOX}`}>
                  <circle fill="none" stroke="var(--hairline-soft)" strokeWidth={2} cx="80" cy="80" r={ANALYTICS_RING_RADIUS} />
                  <circle
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    cx="80" cy="80" r={ANALYTICS_RING_RADIUS}
                    strokeDasharray={savingsCircumference}
                    strokeDashoffset={savingsOffset}
                    style={{ transition: "stroke-dashoffset 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tabular-nums">{savingsRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-caption-sm text-[var(--mute)] uppercase tracking-wider">Tabungan</p>
                <p className="text-heading-xl font-bold tabular-nums">{formatRupiah(totalIncome - totalSpentAmount)}</p>
                <p className="text-caption-md text-[var(--mute)]">dari {formatRupiah(totalIncome)} pendapatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spending per Kategori */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider mb-6">
            Pengeluaran per Kategori
          </h2>
          <div className="space-y-4">
            {cats.map((cat) => {
              const alloc = categoryTotal(state.subCategories, cat);
              const spent = totalSpent(state.transactions, cat, month);
              const pct = alloc > 0 ? (spent / alloc) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-body-strong">
                      <div className="w-2 h-2 rounded-nike-sm bg-[var(--ink)]" />
                      {CATEGORY_META[cat].label}
                    </span>
                    <span className="text-caption-sm tabular-nums">
                      {formatRupiah(spent)} / {formatRupiah(alloc)}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--hairline-soft)] overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: "var(--ink)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider mb-4">
            Detail Kategori
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cats.map((cat) => {
              const subs = state.subCategories.filter((s) => s.category === cat);
              const alloc = categoryTotal(state.subCategories, cat);
              const spent = totalSpent(state.transactions, cat, month);
              const remaining = alloc - spent;
              return (
                <div key={cat} className="border border-[var(--hairline)] p-4 transition-colors hover:bg-[var(--soft-cloud)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-nike-sm bg-[var(--ink)]" />
                    <span className="text-body-strong">{CATEGORY_META[cat].label}</span>
                    <span className="text-caption-sm text-[var(--mute)]">{state.ratio[cat]}%</span>
                  </div>
                  <div className="space-y-2 text-caption-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">Alokasi</span>
                      <span className="font-medium tabular-nums">{formatRupiah(alloc)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">Terpakai</span>
                      <span className="font-medium tabular-nums text-[var(--ink)]">{formatRupiah(spent)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[var(--hairline)] pt-2">
                      <span className="text-[var(--mute)]">Sisa</span>
                      <span className={cn(
                        "font-bold tabular-nums",
                        remaining < 0 ? "text-[var(--sale)]" : "text-[var(--success)]",
                      )}>
                        {formatRupiah(remaining)}
                      </span>
                    </div>
                  </div>
                  {subs.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {subs.map((sub) => (
                        <div key={sub.id} className="flex justify-between text-caption-sm text-[var(--mute)]">
                          <span>{sub.name}</span>
                          <span className="font-medium tabular-nums">{formatRupiah(sub.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights — SVG Icons */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)] p-6">
          <h2 className="text-body-strong text-[var(--ink)] uppercase tracking-wider mb-4">
            Insight
          </h2>
          <div className="space-y-3">
            {savingsRate >= 20 && (
              <div className="flex items-start gap-3 p-4 border border-[var(--hairline)]">
                <div className="w-8 h-8 flex items-center justify-center text-[var(--success)] flex-shrink-0">
                  <CheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-strong">Tabungan target tercapai</p>
                  <p className="text-caption-md text-[var(--mute)] mt-1">
                    Kamu menabung {savingsRate.toFixed(1)}% dari pendapatan. Lebih dari target 20%.
                  </p>
                </div>
              </div>
            )}
            {savingsRate < 20 && savingsRate > 0 && (
              <div className="flex items-start gap-3 p-4 border border-[var(--hairline)]">
                <div className="w-8 h-8 flex items-center justify-center text-[var(--ink)] flex-shrink-0">
                  <WarnIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-strong">Tabungan di bawah target</p>
                  <p className="text-caption-md text-[var(--mute)] mt-1">
                    Hanya {savingsRate.toFixed(1)}% tersisa. Coba kurangi pengeluaran keinginan.
                  </p>
                </div>
              </div>
            )}
            {savingsRate <= 0 && (
              <div className="flex items-start gap-3 p-4 border border-[var(--hairline)]">
                <div className="w-8 h-8 flex items-center justify-center text-[var(--sale)] flex-shrink-0">
                  <DangerIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-strong text-[var(--sale)]">Pengeluaran melebihi pendapatan</p>
                  <p className="text-caption-md text-[var(--mute)] mt-1">
                    Kamu menghabiskan {formatRupiah(Math.abs(totalIncome - totalSpentAmount))} lebih dari pendapatan.
                  </p>
                </div>
              </div>
            )}
            {state.transactions.length === 0 && (
              <div className="flex items-start gap-3 p-4 border border-[var(--hairline)]">
                <div className="w-8 h-8 flex items-center justify-center text-[var(--mute)] flex-shrink-0">
                  <InfoIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-strong">Belum ada data transaksi</p>
                  <p className="text-caption-md text-[var(--mute)] mt-1">
                    Tambah transaksi pertama di halaman Transaksi untuk mulai melihat analitik.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}