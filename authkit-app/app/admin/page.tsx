import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

const controls = [
  ["Broker connections", "Provider OAuth and account capability status", "Not configured"],
  ["Auto-trading", "Strategy permissions, per-account limits and emergency pause", "Disabled until verified"],
  ["Nano AI", "Question answering, model configuration and usage controls", "AI provider not configured"],
  ["AGI OS", "Permission-gated orchestration for approved application tasks", "Experimental architecture"],
  ["Risk controls", "Daily loss limits, order limits and global trading halt", "Live execution locked"],
  ["Members & plans", "Account status, entitlements and support actions", "Database integration required"],
  ["Audit & security", "Admin activity, session revocation and security events", "Audit storage setup required"],
  ["Market data", "Feed health, quote freshness and data entitlements", "No live feed connected"],
];

export default async function AdminPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const email = (user.email || "").trim().toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
  if (!email || !admins.includes(email)) redirect("/dashboard");

  return (
    <main style={{minHeight:"100vh",background:"radial-gradient(900px 480px at 12% -10%,#123b27 0%,transparent 65%),#030805",color:"#f4fff7",padding:"26px 18px 50px",fontFamily:"Arial,sans-serif"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap",borderBottom:"1px solid #234432",paddingBottom:20}}>
          <a href="/dashboard" style={{color:"#8df5aa",textDecoration:"none",fontWeight:900,letterSpacing:1}}>MAMBA FX ACADEMY</a>
          <div style={{display:"flex",gap:16,alignItems:"center",fontSize:13,color:"#b7cdbd"}}><span>CEO CONTROL · {email}</span><a href="/sign-out" style={{color:"#8df5aa"}}>Sign out</a></div>
        </header>
        <section style={{padding:"34px 0 22px"}}>
          <div style={{color:"#72f29b",fontSize:11,fontWeight:800,letterSpacing:2}}>STRIKE FAST · TRADE SMART</div>
          <h1 style={{fontSize:"clamp(30px,5vw,46px)",margin:"10px 0"}}>CEO Control Centre</h1>
          <p style={{color:"#a9c6b5",lineHeight:1.65,maxWidth:760}}>Manage Mamba FX Academy's trading platform, broker integrations, Nano AI, AGI OS, risk controls and member access. High-impact actions must be authenticated, permission-checked and recorded in the audit log.</p>
        </section>
        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:14}}>
          {controls.map(([title,detail,status])=><article key={title} style={{background:"linear-gradient(140deg,rgba(255,255,255,.11),rgba(255,255,255,.025) 50%,rgba(38,230,117,.07))",border:"1px solid rgba(195,255,213,.22)",borderRadius:18,padding:20,backdropFilter:"blur(20px)"}}>
            <h2 style={{fontSize:18,margin:"0 0 9px"}}>{title}</h2><p style={{color:"#a9c6b5",fontSize:13,lineHeight:1.55,minHeight:42}}>{detail}</p><div style={{borderTop:"1px solid #315a3e",paddingTop:12,color:"#9bffb8",fontSize:12,fontWeight:700}}>{status}</div>
          </article>)}
        </section>
        <aside style={{marginTop:22,padding:18,borderRadius:14,background:"rgba(77,57,17,.24)",border:"1px solid #80652b",color:"#e8d9aa",fontSize:13,lineHeight:1.65}}>
          <strong>Safety status:</strong> Live broker orders, automated execution, deposits, withdrawals and real-money options are locked. This panel does not display invented users, balances, trades or profits. Enable a control only after its backend, permissions, provider approval, jurisdiction checks and audit trail are implemented and tested.
        </aside>
        <footer style={{color:"#718b79",fontSize:12,marginTop:24}}>Mamba FX Academy · Restricted administrator workspace</footer>
      </div>
    </main>
  );
}
