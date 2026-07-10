"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { cn, formatRupiah, formatNumberInput } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/budget";

const categories = [
  { value: "need", label: "Kebutuhan", color: "var(--ink)" },
  { value: "want", label: "Keinginan", color: "var(--mute)" },
  { value: "save", label: "Tabungan", color: "var(--success)" },
];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { note?: string; amount: number; category: string; date: string }) => void;
  initial?: any;
}

function TransactionModal({ open, onClose, onSave, initial }: ModalProps) {
  const [form, setForm] = useState({
    note: initial?.note || "",
    amount: initial?.amount?.toString() || "",
    category: initial?.category || "need",
    date: initial?.date || new Date().toISOString().split("T")[0],
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-[var(--canvas)] w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-md font-semibold">
            {initial ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button className="btn-nike-icon transparent" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-caption-sm text-[var(--mute)] mb-1 block">Nama Transaksi</label>
            <input
              className="nike-input"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Mis: Makan siang, Bensin"
            />
          </div>

          <div>
            <label className="text-caption-sm text-[var(--mute)] mb-1 block">Jumlah (Rp)</label>
            <input
              className="nike-input"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: formatNumberInput(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-caption-sm text-[var(--mute)] mb-1 block">Kategori</label>
            <select
              className="nike-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-caption-sm text-[var(--mute)] mb-1 block">Tanggal</label>
            <input
              className="nike-input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-nike-secondary flex-1 text-button-sm" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn-nike-primary flex-1 text-button-sm"
            onClick={() => {
              const amount = parseInt(form.amount.replace(/[^0-9]/g, ""), 10);
              if (!isNaN(amount) && amount > 0) {
                onSave({ note: form.note, amount, category: form.category, date: form.date });
                onClose();
              }
            }}
            disabled={!form.amount || parseInt(form.amount.replace(/[^0-9]/g, "")) <= 0}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { state, addTransaction, updateTransaction, deleteTransaction } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = state.transactions
    .filter((t) => {
      if (search && !(t.note || "").toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-heading-xl font-bold">Transaksi</h1>
          <button className="btn-nike-primary text-button-sm w-full sm:w-auto" onClick={() => { setEditId(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4">
          <input
            className="nike-search-pill"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              className={cn("nike-filter-chip", filterCategory === "all" && "active")}
              onClick={() => setFilterCategory("all")}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c.value}
                className={cn("nike-filter-chip", filterCategory === c.value && "active")}
                onClick={() => setFilterCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="nike-card bg-[var(--canvas)]">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-caption-md text-[var(--mute)]">
                {state.transactions.length === 0
                  ? "Belum ada transaksi"
                  : "Tidak ada transaksi yang cocok"}
              </p>
              <button
                className="btn-nike-primary mt-4 text-button-sm"
                onClick={() => { setEditId(null); setModalOpen(true); }}
              >
                <Plus className="w-4 h-4" />
                Tambah Transaksi
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--hairline)]">
              {filtered.map((t) => {
                const cat = categories.find((c) => c.value === t.category);
                return (
                  <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--soft-cloud)] transition-colors">
                    <div className="flex-1">
                      <p className="text-body-strong">{t.note || "—"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-nike-full" style={{ backgroundColor: cat?.color }} />
                        <span className="text-caption-sm text-[var(--mute)]">{cat?.label}</span>
                        <span className="text-caption-sm text-[var(--mute)]">·</span>
                        <span className="text-caption-sm text-[var(--mute)]">{t.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-body-strong tabular-nums">-{formatRupiah(t.amount)}</span>
                      <button
                        className="btn-nike-icon transparent w-8 h-8"
                        onClick={() => {
                          setEditId(t.id);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="btn-nike-icon transparent w-8 h-8"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditId(null); }}
        onSave={(data) => {
          if (editId) {
            updateTransaction(editId, { ...data, category: data.category as any });
          } else {
            addTransaction({ ...data, subCategory: "", category: data.category as any });
          }
        }}
        initial={editId ? state.transactions.find((t) => t.id === editId) : undefined}
      />
    </AppShell>
  );
}