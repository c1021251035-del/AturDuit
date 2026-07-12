"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

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

function formatNumberInput(val: string) {
  const digits = val.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
}

export default function OnboardingPage() {
  const router = useRouter();
  const { state, setProfile, setIncome, onboard } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if already onboarded
  useEffect(() => {
    if (mounted && state.budgetMonth) {
      router.replace("/dashboard");
    }
  }, [mounted, state.budgetMonth, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-caption-md text-[var(--mute)]">Memuat...</p>
        </div>
      </div>
    );
  }

  // Already onboarded
  if (state.budgetMonth) return null;

  const profiles = [
    { id: "pekerja", label: "Pekerja", desc: "Penghasilan tetap bulanan", Icon: BriefcaseIcon },
    { id: "mahasiswa", label: "Mahasiswa", desc: "Budget kuliah dan kebutuhan", Icon: GraduationIcon },
    { id: "wirausaha", label: "Wirausaha", desc: "Penghasilan tidak tetap", Icon: RocketIcon },
  ];

  const isProfileSelected = !!state.profile;
  const isIncomeSet = state.income > 0;
  const canStart = isProfileSelected && isIncomeSet;

  const handleStart = () => {
    if (!canStart || !state.profile) return;
    onboard({ profile: state.profile, income: state.income });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1
            className="text-[var(--ink)] uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "64px", lineHeight: "1" }}
          >
            AturDuit
          </h1>
          <p className="text-caption-md text-[var(--mute)] mt-3">
            Atur keuanganmu dengan 50/30/20
          </p>
        </div>

        {/* Profile Selection */}
        <div className="mb-10">
          <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-[0.1em] mb-4">
            Pilih Profil
          </h2>
          <div className="flex flex-col gap-2">
            {profiles.map(({ id, label, desc, Icon }) => {
              const active = state.profile === id;
              return (
                <button
                  key={id}
                  onClick={() => setProfile(id as any)}
                  className={`flex items-center gap-4 w-full p-4 border transition-all duration-150 text-left cursor-pointer ${
                    active
                      ? "bg-[var(--ink)] text-[var(--canvas)] border-[var(--ink)]"
                      : "bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:border-[var(--ink)]"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center ${
                    active ? "text-[var(--canvas)]" : "text-[var(--ink)]"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-strong">{label}</p>
                    <p className={`text-caption-sm ${active ? "text-[var(--stone)]" : "text-[var(--mute)]"}`}>
                      {desc}
                    </p>
                  </div>
                  {active && (
                    <svg className="w-5 h-5 text-[var(--canvas)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Income Input */}
        <div className="pt-8 border-t border-[var(--hairline)]">
          <h2 className="text-caption-sm text-[var(--mute)] uppercase tracking-[0.1em] mb-4">
            Berapa Pendapatanmu?
          </h2>
          <div className="flex items-baseline gap-2 border-b-2 border-[var(--ink)] pb-2">
            <span className="text-heading-lg text-[var(--mute)] font-medium">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              className="text-heading-xl font-medium tabular-nums flex-1 bg-transparent outline-none text-[var(--ink)] placeholder:text-[var(--mute)]"
              placeholder="5.000.000"
              value={state.income > 0 ? formatNumberInput(String(state.income)) : ""}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(num)) setIncome(num);
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="btn-nike-primary w-full mt-8"
        >
          Mulai
        </button>
      </div>
    </div>
  );
}
