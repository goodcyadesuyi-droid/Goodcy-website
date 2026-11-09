import { withAuth } from "@workos-inc/authkit-nextjs";

const capabilities = [
  { title: "AI market research", text: "A workspace for reviewing market context, economic events and technical-analysis notes before making a decision." },
  { title: "MT5 connection readiness", text: "Designed for a future MetaTrader 5 connection through a broker-approved integration. No broker account is connected yet." },
  { title: "Risk controls", text: "Plan position size, stop-loss levels, exposure limits and a daily loss limit before any trade is considered." },
  { title: "Trade journal & review", text: "Keep a record of trade ideas, reasons, outcomes and lessons so decisions can be reviewed." },
];

export default async function TradingOSPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const displayName = user.firstName || user.email?.split("@")[0] || "Member";
  return (
    <main className="os-shell">
      <header className="os-topbar">
        <a className="app-brand" href="/dashboard"><span className="brand-mark">MFX</span><span>MAMBA FX <b>ACADEMY</b></span></a>
        <a className="os-back" href="/dashboard">← Member dashboard</a>
      </header>
      <section className="os-hero">
        <div className="os-kicker">MAMBA FX ACADEMY · PREMIUM PRODUCT</div>
        <h1>Intelligent Trading <span>Operating System</span></h1>
        <p>Welcome, {displayName}. A premium trading workspace combining AI-assisted research, disciplined risk planning, trade journaling and a future MT5 integration.</p>
        <div className="os-price">Premium package · $10,000 USD · 1 year</div>
        <div className="os-status">Product preview — payment verification, broker connection and live trading execution are not enabled.</div>
        <div className="os-actions"><a className="os-primary" href="#workspace">Explore workspace</a><a className="os-secondary" href="mailto:goodcyadesuyi@gmail.com?subject=Mamba%20FX%20Trading%20OS%20Enquiry">Contact the academy</a></div>
      </section>
      <section className="os-grid" id="workspace">
        {capabilities.map((item) => <article className="os-card" key={item.title}><h2>{item.title}</h2><p>{item.text}</p></article>)}
        <article className="os-card">
          <h2>Two product descriptions</h2>
          <p><strong>AI-Powered Intelligent Operating System (AI OS)</strong> describes the practical AI-assisted product being planned.</p>
          <p><strong>AGI-Powered Intelligent Operating System (AGI OS)</strong> is the long-term vision, not a claim that the current app has achieved AGI.</p>
        </article>
        <article className="os-card">
          <h2>Premium access</h2>
          <p>The proposed package is $10,000 USD for one year. Access must be activated only after a secure payment provider confirms payment and the membership entitlement is recorded.</p>
        </article>
        <article className="os-card os-wide">
          <h2>Before real-money trading is enabled</h2>
          <ul>
            <li>Choose and approve a regulated broker and confirm its MT5 integration method.</li>
            <li>Build server-side trade permissions, account isolation and secure credential handling. Never share broker passwords in chat.</li>
            <li>Test in a demo account, validate risk limits and add a user-controlled emergency stop.</li>
            <li>Complete applicable legal, regulatory, privacy and financial-risk disclosures.</li>
          </ul>
          <div className="os-callout">This page is currently an authenticated product preview. It does not connect to MT5, place orders, manage funds or verify $10,000 payments. AI analysis can be wrong; trading can cause losses. No returns are guaranteed.</div>
        </article>
      </section>
    </main>
  );
}
