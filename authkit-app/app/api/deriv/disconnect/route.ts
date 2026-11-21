import { NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { clearDerivSession } from "@/lib/deriv/session";
export async function POST() {
  await withAuth({ensureSignedIn:true});
  await clearDerivSession();
  return NextResponse.json({connected:false});
}
