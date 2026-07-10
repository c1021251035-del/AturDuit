"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetState, OnboardingPayload, TransactionPayload, Profile, Ratio } from "../lib/types";
import { DEFAULT_RATIO, buildSubCategories } from "../lib/budget";

const STORAGE_KEY = "aturduit:v1";

const initialState: BudgetState = {
  profile: null,
  income: 0,
  ratio: DEFAULT_RATIO,
  subCategories: [],
  transactions: [],
  budgetMonth: "",
};

type Store = {
  state: BudgetState;
  setProfile: (profile: Profile) => void;
  setIncome: (income: number) => void;
  setRatio: (ratio: Ratio) => void;
  rebuildSubCategories: () => void;
  addTransaction: (payload: TransactionPayload) => void;
  updateSubCategory: (id: string, amount: number) => void;
  updateTransaction: (id: string, payload: Partial<TransactionPayload>) => void;
  deleteTransaction: (id: string) => void;
  onboard: (payload: OnboardingPayload) => void;
  reset: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      state: { ...initialState },

      setProfile: (profile) =>
        set((s) => ({ state: { ...s.state, profile } })),

      setIncome: (income) =>
        set((s) => ({ state: { ...s.state, income } })),

      setRatio: (ratio) => {
        set((s) => ({ state: { ...s.state, ratio } }));
        get().rebuildSubCategories();
      },

      rebuildSubCategories: () => {
        const { profile, income, ratio } = get().state;
        if (!profile) return;
        const subCategories = buildSubCategories(profile, income, ratio);
        set((s) => ({ state: { ...s.state, subCategories } }));
      },

      addTransaction: (payload) => {
        const id = `tx-${Date.now()}`;
        const date = payload.date || new Date().toISOString().split("T")[0];
        const transaction = { id, date, ...payload };
        set((s) => ({ state: { ...s.state, transactions: [...s.state.transactions, transaction] } }));
      },

      updateSubCategory: (id, amount) => {
        set((s) => ({
          state: {
            ...s.state,
            subCategories: s.state.subCategories.map((sub) =>
              sub.id === id ? { ...sub, amount } : sub
            ),
          },
        }));
      },

      updateTransaction: (id, payload) => {
        set((s) => ({
          state: {
            ...s.state,
            transactions: s.state.transactions.map((t) =>
              t.id === id ? { ...t, ...payload } : t
            ),
          },
        }));
      },

      deleteTransaction: (id) => {
        set((s) => ({
          state: {
            ...s.state,
            transactions: s.state.transactions.filter((t) => t.id !== id),
          },
        }));
      },

      onboard: (payload) => {
        const month = new Date().toISOString().slice(0, 7);
        const subCategories = buildSubCategories(payload.profile, payload.income, DEFAULT_RATIO);
        set({
          state: {
            profile: payload.profile,
            income: payload.income,
            ratio: DEFAULT_RATIO,
            subCategories,
            transactions: [],
            budgetMonth: month,
          },
        });
      },

      reset: () => set({ state: { ...initialState } }),
    }),
    { name: STORAGE_KEY }
  )
);
