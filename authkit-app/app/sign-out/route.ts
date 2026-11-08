import { getSignOutUrl } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
export async function GET() {
  const url = await getSignOutUrl();
  return NextResponse.redirect(url);
}
