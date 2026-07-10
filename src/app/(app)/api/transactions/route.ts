import { NextResponse } from "next/server";
import type { TransactionPayload } from "../../../lib/types";

export async function POST(request: Request) {
  const payload: TransactionPayload = await request.json();
  const id = `tx-${Date.now()}`;
  const date = payload.date || new Date().toISOString().split('T')[0];
  const transaction = { id, date, ...payload };

  return NextResponse.json({ success: true, transaction });
}