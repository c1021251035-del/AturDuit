import { NextResponse } from "next/server";
import { DEFAULT_RATIO, buildSubCategories, currentMonth } from "../../../lib/budget";
import type { OnboardingPayload } from "../../../lib/types";

export async function POST(request: Request) {
  const payload: OnboardingPayload = await request.json();
  const month = currentMonth();
  const subCategories = buildSubCategories(payload.profile, payload.income, DEFAULT_RATIO);
  const state = {
    profile: payload.profile,
    income: payload.income,
    ratio: DEFAULT_RATIO,
    subCategories,
    transactions: [],
    budgetMonth: month,
  };

  return NextResponse.json({ success: true, state });
}