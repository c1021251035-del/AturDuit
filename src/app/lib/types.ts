"use strict";

export type Profile = "mahasiswa" | "pekerja" | "freelancer" | "wirausaha" | "lainnya";

export type Category = "need" | "want" | "save";

export type Status = "safe" | "warn" | "over" | "empty";

export type Ratio = Record<Category, number>;

export interface SubCategory {
  id: string;
  name: string;
  category: Category;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO date
  category: Category;
  subCategory?: string;
  amount: number;
  note?: string;
}

export interface BudgetState {
  profile: Profile | null;
  income: number;
  ratio: Ratio;
  subCategories: SubCategory[];
  transactions: Transaction[];
  budgetMonth: string; // YYYY-MM
}

export interface OnboardingPayload {
  profile: Profile;
  income: number;
}

export interface TransactionPayload {
  date?: string;
  category: Category;
  subCategory?: string;
  amount: number;
  note?: string;
}

export interface SubCategoryPayload {
  name: string;
  category: Category;
  amount: number;
}