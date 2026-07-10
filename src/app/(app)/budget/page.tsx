"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RotateCcw, Plus, Minus } from "lucide-react";
import { cn, formatRupiah, formatMonth, formatNumberInput } from "@/lib/utils";
import { CATEGORY_META, currentMonth, statusFor, categoryTotal, totalSpent } from "@/lib/budget";
import { useState } from "react";

const cats = ["need", "want", "save"] as const;

export default function BudgetPage() {
  const { state, setRatio, updateSubCategory, rebuildSubCategories } = useStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const month = state.budgetMonth || currentMonth();
  const monthLabel = formatMonth(month);

  const handleRatioChange = (key: typeof cats[number], delta: number) => {
    const current = state.ratio[key];
    const capped = Math.min(100, Math.max(0, current + delta));
    const others = cats.filter(k => k !== key);
    const totalOthers = others.reduce((sum, k) => sum + state.ratio[k], 0);
    const rest = 100 - capped;

    const newRatio = { ...state.ratio, [key]: capped };
    if (totalOthers > 0) {
      others.forEach((k, i) => {
        newRatio[k] = i === others.length - 1
          ? rest - others.slice(0, -1).reduce((sum, k) => sum + newRatio[k], 0)
          : Math.round((state.ratio[k] / totalOthers) * rest);
      });
    }
    setRatio(newRatio);
    rebuildSubCategories();
  };

  const circumference = 2 * Math.PI * 54;

  const ringMap: Record<string, string> = {
    need: "stroke-[var(--ink)]",
    want: "stroke-[var(--mute)]",
    save: "stroke-[var(--success)]",
  };
  const ringBgMap: Record<string, string> = {
    need: "stroke-[var(--ink)]/10",
    want: "stroke-[var(--mute)]/10",
    save: "stroke-[var(--success)]/10",
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-heading-xl font-bold">Budget Bulanan</h1>
            <p className="text-caption-md text-[var(--mute)] mt-1">{monthLabel}</p>
          </div>
          <button
            onClick={rebuildSubCategories}
            className="btn-nike-secondary text-button-sm py-2 px-4 h-10"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Income */}
        <Card className="nike-card bg-[var(--canvas)]">
          <div className="p-6">
            <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-wider mb-2">
              Total Pendapatan
            </h2>
            <p className="text-heading-xl font-bold tabular-nums">{formatRupiah(state.income)}</p>
          </div>
        </Card>

        {/* Circular Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cats.map((cat) => {
            const pct = state.ratio[cat];
            const alloc = categoryTotal(state.subCategories, cat);
            const spent = totalSpent(state.transactions, cat, month);
            const strokeDashoffset = circumference * (1 - pct / 100);
            const catColor = cat === "need" ? "var(--ink)" : cat === "want" ? "var(--mute)" : "var(--success)";

            return (
              <Card key={cat} className="nike-card bg-[var(--canvas)]">
                <div className="p-6 text-center">
                  {/* Ring */}
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <svg className="w-full h-full nike-progress-ring" viewBox="0 0 144 144">
                      <circle
                        className="nike-progress-ring-bg"
                        cx="72" cy="72" r="54"
                        style={{ stroke: `color-mix(in srgb, ${catColor} 12%, transparent)` }}
                      />
                      <circle
                        className="nike-progress-ring-fg"
                        cx="72" cy="72" r="54"
                        stroke={catColor}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold tabular-nums">{pct}%</span>
                      <span className="text-caption-sm text-[var(--mute)] uppercase tracking-wider mt-1">
                        {CATEGORY_META[cat].label}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-body-strong tabular-nums">{formatRupiah(alloc)}</p>
                  <p className="text-caption-sm text-[var(--mute)] mt-1">
                    Terpakai: {formatRupiah(spent)}
                  </p>

                  {/* Quick adjust */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      className="btn-nike-icon"
                      onClick={() => handleRatioChange(cat, -5)}
                      disabled={pct <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-button-md w-10 text-center tabular-nums">{pct}%</span>
                    <button
                      className="btn-nike-icon"
                      onClick={() => handleRatioChange(cat, 5)}
                      disabled={pct >= 100}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Category Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cats.map((cat) => {
            const subs = state.subCategories.filter((s) => s.category === cat);
            const alloc = categoryTotal(state.subCategories, cat);
            const spent = totalSpent(state.transactions, cat, month);
            const status = statusFor(spent, alloc);
            const statusLabel = {
              over: "Melebihi budget",
              warn: "Hampir penuh",
              safe: "Terkontrol",
              empty: "Belum ada alokasi",
            }[status];

            return (
              <Card key={cat} className="nike-card bg-[var(--canvas)]">
                <div className="border-t-2" style={{ borderTopColor: cat === "need" ? "var(--ink)" : cat === "want" ? "var(--mute)" : "var(--success)" }}>
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-body-strong">{CATEGORY_META[cat].label}</h2>
                      <span className="text-caption-sm text-[var(--mute)]">{state.ratio[cat]}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-heading-md font-bold tabular-nums">{formatRupiah(alloc)}</p>
                      <span className={cn(
                        "text-caption-sm",
                        status === "safe" && "text-[var(--success)]",
                        status === "warn" && "text-[var(--accent-teal)]",
                        status === "over" && "text-[var(--sale)]",
                        status === "empty" && "text-[var(--mute)]",
                      )}>{statusLabel}</span>
                    </div>
                  </div>
                  <CardContent className="p-5 pt-0">
                    {subs.length === 0 ? (
                      <div className="text-center py-4 border border-dashed border-[var(--hairline)] rounded-nike-none">
                        <p className="text-caption-sm text-[var(--mute)]">Belum ada sub-kategori</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {subs.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between py-2 border-b border-[var(--hairline)] last:border-0">
                            <span className="text-caption-md">{sub.name}</span>
                            {editId === sub.id ? (
                              <Input
                                className="w-28 h-7 text-caption-sm text-right tabular-nums rounded-nike-none"
                                value={editValue}
                                onChange={(e) => setEditValue(formatNumberInput(e.target.value))}
                                onBlur={() => {
                                  if (!editId) return;
                                  const val = parseInt(editValue.replace(/[^0-9]/g, ""), 10);
                                  if (!isNaN(val)) updateSubCategory(editId, val);
                                  setEditId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    if (!editId) return;
                                    const val = parseInt(editValue.replace(/[^0-9]/g, ""), 10);
                                    if (!isNaN(val)) updateSubCategory(editId, val);
                                    setEditId(null);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              <button
                                className="text-caption-md font-medium tabular-nums hover:opacity-70 transition-opacity"
                                onClick={() => {
                                  setEditId(sub.id);
                                  setEditValue(sub.amount.toLocaleString("id-ID"));
                                }}
                              >
                                {formatRupiah(sub.amount)}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}