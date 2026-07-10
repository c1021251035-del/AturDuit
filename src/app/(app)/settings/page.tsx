"use client";

import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { cn, formatRupiah, formatNumberInput } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/budget";
import { useState } from "react";

const cats = ["need", "want", "save"] as const;

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const profileOptions = [
  { value: "pekerja", label: "Pekerja", Icon: BriefcaseIcon, desc: "Penghasilan tetap bulanan" },
  { value: "mahasiswa", label: "Mahasiswa", Icon: GraduationIcon, desc: "Budget kuliah dan kebutuhan" },
  { value: "wirausaha", label: "Wirausaha", Icon: RocketIcon, desc: "Penghasilan tidak tetap" },
];

export default function SettingsPage() {
  const { state, setProfile, setIncome, setRatio, reset } = useStore();
  const [income, setIncomeVal] = useState(state.income?.toString() || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (income) {
      const num = parseInt(income.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(num)) setIncome(num);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Hapus semua data dan mulai ulang?")) {
      setIncomeVal("");
      reset();
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-8 px-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-xl font-bold">Pengaturan</h1>
          <p className="text-caption-md text-[var(--mute)] mt-1">
            Kelola profil dan preferensi
          </p>
        </div>

        {/* Profile */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)]">
          <div className="p-6 border-b border-[var(--hairline)]">
            <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-wider">
              Profil
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-2">
              {profileOptions.map((p) => (
                <button
                  key={p.value}
                  className={cn(
                    "flex flex-col items-center gap-1 p-4 border transition-all duration-150 cursor-pointer",
                    state.profile === p.value
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]"
                      : "border-[var(--hairline)] hover:bg-[var(--soft-cloud)]"
                  )}
                  onClick={() => setProfile(p.value as any)}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <p.Icon className="w-5 h-5" />
                  </div>
                  <span className="text-caption-md font-medium">{p.label}</span>
                  <span className="text-caption-xs text-[var(--mute)]">
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)]">
          <div className="p-6 border-b border-[var(--hairline)]">
            <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-wider">
              Pendapatan
            </h2>
          </div>
          <div className="p-6">
            <label className="text-caption-sm text-[var(--mute)] mb-2 block">Jumlah (Rp)</label>
            <input
              className="nike-input text-heading-md font-bold"
              value={income}
              onChange={(e) => setIncomeVal(formatNumberInput(e.target.value))}
              placeholder="5.000.000"
            />
          </div>
        </div>

        {/* Ratio */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)]">
          <div className="p-6 border-b border-[var(--hairline)]">
            <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-wider">
              Rasio Budget
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {cats.map((cat) => {
              const catColor = cat === "need" ? "var(--ink)" : cat === "want" ? "var(--mute)" : "var(--success)";
              const alloc = Math.round((state.income * state.ratio[cat]) / 100);
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-nike-full" style={{ backgroundColor: catColor }} />
                      <span className="text-body-strong">{CATEGORY_META[cat].label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="btn-nike-icon w-8 h-8"
                        onClick={() => setRatio({ ...state.ratio, [cat]: Math.max(0, state.ratio[cat] - 5) })}
                        disabled={state.ratio[cat] <= 0}
                      >
                        −
                      </button>
                      <span className="text-body-strong tabular-nums w-12 text-center">{state.ratio[cat]}%</span>
                      <button
                        className="btn-nike-icon w-8 h-8"
                        onClick={() => setRatio({ ...state.ratio, [cat]: Math.min(100, state.ratio[cat] + 5) })}
                        disabled={state.ratio[cat] >= 100}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--hairline-soft)] rounded-nike-full overflow-hidden">
                    <div
                      className="h-full rounded-nike-full transition-all duration-300"
                      style={{ width: `${state.ratio[cat]}%`, backgroundColor: catColor }}
                    />
                  </div>
                  <p className="text-caption-sm text-[var(--mute)] tabular-nums">
                    {formatRupiah(alloc)}
                  </p>
                </div>
              );
            })}
            <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between">
              <span className="text-body-strong">Total</span>
              <span className={cn(
                "text-body-strong tabular-nums",
                state.ratio.need + state.ratio.want + state.ratio.save === 100
                  ? "text-[var(--success)]"
                  : "text-[var(--sale)]"
              )}>
                {state.ratio.need + state.ratio.want + state.ratio.save}%
              </span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-[var(--canvas)] border border-[var(--hairline)]">
          <div className="p-6 border-b border-[var(--hairline)]">
            <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-wider">
              Data
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-strong">Reset Data</p>
                <p className="text-caption-sm text-[var(--mute)] mt-1">
                  Hapus semua data dan mulai dari awal
                </p>
              </div>
              <button
                className="btn-nike-secondary text-[var(--sale)] border-[var(--sale)] hover:bg-[var(--sale)]/5"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button className="btn-nike-primary" onClick={handleSave}>
            {saved ? "✓ Tersimpan" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
