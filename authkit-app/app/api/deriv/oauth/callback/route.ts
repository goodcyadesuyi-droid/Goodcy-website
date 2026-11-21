import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { cookies } from "next/headers";
import { saveDerivSession } from "@/lib/deriv/session";
export const dynamic = "force-dynamic";
type Account = { account_id?:string; account_type?:string; currency?:string; is_virtual?:boolean; landing_company_name?:string };
export async function GET(request:NextRequest) {
  const {user}=await withAuth({ensureSignedIn:true});
  const url=new URL("/terminal",process.env.APP_BASE_URL || request.nextUrl.origin);
  const params=request.nextUrl.searchParams;
  const jar=await cookies(), raw=jar.get("mfx_deriv_oauth")?.value;
  jar.delete("mfx_deriv_oauth");
  if(params.get("error")) { url.searchParams.set("deriv","authorization_denied"); return NextResponse.redirect(url); }
  const code=params.get("code"), state=params.get("state");
  let pending:{verifier:string;state:string;redirectUri:string}|null=null;
  try { pending=raw?JSON.parse(raw):null; } catch {}
  if(!code || !state || !pending || state!==pending.state) { url.searchParams.set("deriv","oauth_validation_failed"); return NextResponse.redirect(url); }
  const clientId=process.env.DERIV_CLIENT_ID;
  if(!clientId || !process.env.MFX_DERIV_TOKEN_ENCRYPTION_KEY) { url.searchParams.set("deriv","server_not_configured"); return NextResponse.redirect(url); }
  try {
    const body=new URLSearchParams({grant_type:"authorization_code",client_id:clientId,code,code_verifier:pending.verifier,redirect_uri:pending.redirectUri});
    const tokenResponse=await fetch("https://auth.deriv.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body,cache:"no-store"});
    if(!tokenResponse.ok) throw new Error("Deriv token exchange failed.");
    const token=await tokenResponse.json() as {access_token?:string;expires_in?:number};
    if(!token.access_token || !token.expires_in) throw new Error("Deriv returned an incomplete token response.");
    const accountsResponse=await fetch("https://api.derivws.com/trading/v1/options/accounts",{headers:{Authorization:`Bearer ${token.access_token}`},cache:"no-store"});
    if(!accountsResponse.ok) throw new Error("Could not verify Deriv account permissions.");
    const payload=await accountsResponse.json() as {data?:Account[];accounts?:Account[]};
    const accounts=payload.data || payload.accounts || [];
    const demo=accounts.find(a=>a.account_type?.toLowerCase()==="demo" || a.is_virtual===true);
    if(!demo?.account_id) throw new Error("No Deriv demo Options account was returned. Confirm the demo account is enabled on Deriv.");
    const expiresAt=Date.now()+Math.max(60,token.expires_in-60)*1000;
    await saveDerivSession({userId:user.id,accessToken:token.access_token,accountId:demo.account_id,currency:demo.currency,expiresAt});
    url.searchParams.set("deriv","demo_connected");
    return NextResponse.redirect(url);
  } catch(error) {
    url.searchParams.set("deriv",error instanceof Error?error.message:"connection_failed");
    return NextResponse.redirect(url);
  }
}
