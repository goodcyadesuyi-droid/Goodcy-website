import { NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { readDerivSession } from "@/lib/deriv/session";
export const dynamic = "force-dynamic";
export async function GET() {
  const {user}=await withAuth({ensureSignedIn:true});
  const session=await readDerivSession(user.id);
  return NextResponse.json({provider:"Deriv",connected:!!session,account:session?{accountId:session.accountId,currency:session.currency,environment:"DEMO",expiresAt:new Date(session.expiresAt).toISOString()}:null,permissions:session?["trade"]:[],liveTradingEnabled:false,liveOptionsEnabled:false,depositsEnabled:false,withdrawalsEnabled:false,autoTradingEnabled:false},{headers:{"Cache-Control":"no-store"}});
}
