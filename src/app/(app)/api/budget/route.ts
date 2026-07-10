import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEFAULT_RATIO, buildSubCategories, currentMonth } from "../../../lib/budget";
import type { Ratio, Profile, SubCategory, Transaction } from "../../../lib/types";

const STORAGE_KEY = "aturduit:v1";

function getState(): {
  profile: Profile | null;
  income: number;
  ratio: Ratio;
  subCategories: SubCategory[];
  transactions: Transaction[];
  budgetMonth: string;
} {
  const cookieStore = cookies();
  const data = cookieStore.get(STORAGE_KEY)?.value;
  if (!data) {
    return {
      profile: null,
      income: 0,
      ratio: DEFAULT_RATIO,
      subCategories: [],
      transactions: [],
      budgetMonth: currentMonth(),
    };
  }
  return JSON.parse(data);
}

function setState(state: object) {
  const cookieStore = cookies();
  cookieStore.set(STORAGE_KEY, JSON.stringify(state), { path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function GET() {
  const state = getState();
  return NextResponse.json({
    ratio: state.ratio,
    subCategories: state.subCategories,
  });
}

export async function PATCH(request: Request) {
  const { ratio }: { ratio: Ratio } = await request.json();
  const state = getState();
  const subCategories = buildSubCategories(state.profile || "mahasiswa", state.income, ratio);
  setState({ ...state, ratio, subCategories });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, amount }: { id: string; amount: number } = await request.json();
  const state = getState();
  const subCategories = state.subCategories.map(s => s.id === id ? { ...s, amount } : s);
  setState({ ...state, subCategories });
  return NextResponse.json({ success: true });
}