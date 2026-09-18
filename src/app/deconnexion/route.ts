import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { SITE_URL } from "@/config/site";

export async function POST() {
  await destroySession();
  return NextResponse.redirect(new URL("/", SITE_URL), { status: 303 });
}
