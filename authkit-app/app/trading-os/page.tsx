import { withAuth } from "@workos-inc/authkit-nextjs";

const modules = [
  ["Nano AI Assistant", "Question answering for trading education, platform help and market concepts. Task execution is permission-gated and is not enabled until a secure AI provider and action services are configured."],
  ["AGI OS Orchestrator", "The planned coordination layer for approved trading, AI, automation and security services. AGI is a product vision; this application does not claim human-level general intelligence."],
  ["Broker connections", "Connect through broker-authorized OAuth or a verified server-side gateway. Never enter broker passwords into an unverified web form or share API secrets in chat."],
  ["Auto Trade", "Strategy execution must validate account eligibility, fresh prices, provider capabilities, position sizing, stop-loss, daily loss limits and kill-switch state before any order."],
  ["Risk management", "Configure per-trade exposure, maximum daily loss, maximum open positions and emergency stop. Risk controls cannot guarantee profits or prevent all losses."],
  ["Trade journal & analytics", "Review provider-confirmed executions and account-sourced performance. No illustrative sample should be presented as a real trade or profit."],
];

export default async function TradingOSPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const displayName = user.firstName || user.email?.split("@")[0] || "Member";
  return <main style={{minHeight:"100vh",background:"radial-gradient(900px 480px at 12% -10%,#123b27 0%,transparent 65%),#030805",color:"#f4fff7",padding:"24px 18px 50px",fontFamily:"Arial,sans-serif"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap",borderBottom:"1px solid #234432",paddingBottom:18}}>
        <a href="/dashboard" style={{color:"#8df5aa",textDecoration:"none",fontWeight:900}}>MAMBA FX ACADEMY</a><a href="/terminal" style={{color:"#8df5aa"}}>Trading terminal →</a>
      </header>
      <section style={{padding:"36px 0 24px"}}>
        <div style={{color:"#72f29b",fontSize:11,fontWeight:800,letterSpacing:2}}>NANO TECHNOLOGY AI · AGI OS</div>
        <h1 style={{fontSize:"clamp(32px,6vw,52px)",margin:"10px 0"}}>Intelligent Trading <span style={{color:"#72f29b"}}>Operating System</span></h1>
        <p style={{color:"#a9c6b5",lineHeight:1.65,maxWidth:760}}>Welcome, {displayName}. One Mamba FX workspace for trading research, broker connectivity, risk controls and AI assistance.</p>
        <div style={{display:"inline-block",padding:"10px 14px",border:"1px solid #80652b",borderRadius:12,color:"#e8d9aa",fontSize:12}}>Integration status: AI provider and broker execution are not yet configured. Live trading remains disabled.</div>
      </section>
      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        {modules.map(([title,description])=><article key={title} style={{background:"linear-gradient(140deg,rgba(255,255,255,.11),rgba(255,255,255,.025) 50%,rgba(38,230,117,.07))",border:"1px solid rgba(195,255,213,.22)",borderRadius:18,padding:20,backdropFilter:"blur(20px)"}}><h2 style={{fontSize:18,marginTop:0,color:"#9bffb8"}}>{title}</h2><p style={{fontSize:13,lineHeight:1.65,color:"#c3d8c9"}}>{description}</p></article>)}
      </section>
      <aside style={{marginTop:22,padding:18,borderRadius:14,border:"1px solid #315a3e",background:"rgba(9,30,16,.75)",color:"#c3d8c9",fontSize:13,lineHeight:1.65}}>
        <strong style={{color:"#9bffb8"}}>Free and Pro permissions:</strong> Free members can ask Nano AI questions. Pro members may receive additional task capabilities only after subscription entitlement, user confirmation, scoped permissions and secure action APIs are verified. Computer control and trade execution are never granted by a client-side plan selector.
      </aside>
    </div>
  </main>;
}
