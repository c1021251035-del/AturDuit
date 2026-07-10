"use strict";

import type { Category, Profile, Ratio, SubCategory, Transaction, Status } from "./types";

// Default ratio 50/30/20
export const DEFAULT_RATIO: Ratio = { need: 50, want: 30, save: 20 };

// Sub-kategori default per profil
export const PROFILE_SUB_CATEGORIES: Record<Profile, Omit<SubCategory, 'id' | 'amount'>[]> = {
  mahasiswa: [
    { name: "Uang Kos", category: "need" },
    { name: "Uang Makan", category: "need" },
    { name: "Transportasi Kampus", category: "need" },
    { name: "Pulsa/Internet", category: "need" },
    { name: "Buku & Alat Kuliah", category: "need" },
    { name: "Jajan/Hiburan", category: "want" },
    { name: "Tabungan", category: "save" },
  ],
  pekerja: [
    { name: "Cicilan/Sewa", category: "need" },
    { name: "Transportasi Kerja", category: "need" },
    { name: "Makan Harian", category: "need" },
    { name: "Asuransi", category: "need" },
    { name: "Hiburan & Gaya Hidup", category: "want" },
    { name: "Tabungan & Investasi", category: "save" },
  ],
  freelancer: [
    { name: "Operasional Bisnis", category: "need" },
    { name: "Transportasi", category: "need" },
    { name: "Makan", category: "need" },
    { name: "Pajak & Asuransi", category: "need" },
    { name: "Pengembangan Diri", category: "want" },
    { name: "Tabungan Darurat", category: "save" },
  ],
  wirausaha: [
    { name: "Modal Usaha", category: "need" },
    { name: "Operasional", category: "need" },
    { name: "Gaji Karyawan", category: "need" },
    { name: "Pajak", category: "need" },
    { name: "Pengembangan Produk", category: "want" },
    { name: "Tabungan & Investasi", category: "save" },
  ],
  lainnya: [
    { name: "Kebutuhan Pokok", category: "need" },
    { name: "Keinginan", category: "want" },
    { name: "Tabungan", category: "save" },
  ],
};

// Metadata kategori
export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  need: { label: "Kebutuhan", color: "var(--ink)" },
  want: { label: "Keinginan", color: "var(--mute)" },
  save: { label: "Tabungan", color: "var(--success)" },
};

// Format Rupiah
export function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

// Bulan saat ini (YYYY-MM)
export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Format bulan (contoh: "Juli 2026")
export function formatMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${months[m - 1]} ${year}`;
}

// Hitung total per kategori
export function categoryTotal(subCategories: SubCategory[], category: Category): number {
  return subCategories.filter(s => s.category === category).reduce((sum, s) => sum + s.amount, 0);
}

// Hitung total terpakai per kategori
export function totalSpent(transactions: Transaction[], category: Category, month: string): number {
  return transactions
    .filter(t => t.category === category && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);
}

// Status kategori
export function statusFor(spent: number, alloc: number): Status {
  if (alloc <= 0) return "empty";
  const pct = (spent / alloc) * 100;
  if (pct >= 100) return "over";
  if (pct >= 80) return "warn";
  return "safe";
}

// Bangun sub-kategori dari rasio
export function buildSubCategories(profile: Profile, income: number, ratio: Ratio): SubCategory[] {
  const subs = PROFILE_SUB_CATEGORIES[profile];
  const totalNeed = (income * ratio.need) / 100;
  const totalWant = (income * ratio.want) / 100;
  const totalSave = (income * ratio.save) / 100;

  // Distribusi merata per kategori
  const needSubs = subs.filter(s => s.category === "need");
  const wantSubs = subs.filter(s => s.category === "want");
  const saveSubs = subs.filter(s => s.category === "save");

  return [
    ...needSubs.map((s, i) => ({
      ...s,
      id: `need-${i + 1}`,
      amount: Math.round(totalNeed / needSubs.length),
    })),
    ...wantSubs.map((s, i) => ({
      ...s,
      id: `want-${i + 1}`,
      amount: Math.round(totalWant / wantSubs.length),
    })),
    ...saveSubs.map((s, i) => ({
      ...s,
      id: `save-${i + 1}`,
      amount: Math.round(totalSave / saveSubs.length),
    })),
  ];
}