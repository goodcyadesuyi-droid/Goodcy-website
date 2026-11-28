import { withAuth } from "@workos-inc/authkit-nextjs";

const tools = [
  { icon: "▥", title: "Trading Terminal", subtitle: "Forex / Options", description: "Open charts, explore markets and practise with a demo workspace.", href: "/terminal", action: "Open terminal" },
  { icon: "↗", title: "Futures", subtitle: "Futures markets", description: "Explore futures contracts, margin, expiry and educational market tools.", href: "/futures", action: "Open futures" },\n  { icon: "↗", title: "Deriv Demo Connection", subtitle: "Demo account", description: "Connect through Deriv's official account authorisation flow.", href: "/api/deriv/oauth/start", action: "Connect Deriv", tag: "DEMO ONLY · LIVE TRADING OFF" },
  { icon: "◉", title: "Nano AI Assistant", subtitle: "Ask & learn", description: "Get help understanding markets, trading concepts and platform features.", href: "/nano-ai", action: "Open Nano AI" },
  { icon: "✧", title: "AGI OS", subtitle: "Smart trading assistant", description: "Explore the assistant workspace. Actions require secure setup and your approval.", href: "/agi-os", action: "Open AGI OS" },
  { icon: "⬡", title: "Risk Management", subtitle: "Set limits", description: "Review position sizing, stop-loss planning and risk controls.", href: "/risk-management", action: "Manage risk" },
  { icon: "♛", title: "CEO Control Panel", subtitle: "Admin access", description: "Protected controls for platform settings, integrations and oversight.", href: "/admin", action: "Open CEO panel", tag: "APPROVED ADMINS ONLY" },
];

export default async function Dashboard() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const displayName = user.firstName || user.email?.split("@")[0] || "Trader";

  return (
    <main className="mfx-dashboard">
      <header className="mfx-topbar">
        <a className="mfx-brand" href="/dashboard">
          <img src="/mamba-fx-academy-logo.webp" alt="Mamba FX Academy official logo" />
          <span><b>MAMBA FX</b><strong>ACADEMY</strong></span>
        </a>
        <div className="mfx-top-actions"><span className="mfx-connected"><i /> Demo workspace</span><a className="mfx-profile-dot" href="#profile" aria-label="Profile">{displayName.slice(0,1).toUpperCase()}</a></div>
      </header>

      <section className="mfx-command-hero">
        <div className="mfx-hero-copy"><div className="mfx-kicker">YOUR TRADING COMMAND CENTRE</div><h1>Learn. Trade.<br/><em>Trade smarter.</em></h1><p>Welcome back, {displayName}. Your trading tools, learning resources and AI workspace are together in one place.</p><a href="/terminal" className="mfx-primary-cta">Explore trading terminal <span>↗</span></a></div>
        <div className="mfx-chart-art" aria-hidden="true"><div className="mfx-chart-grid"/><div className="mfx-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="mfx-chart-arrow">↗</div><span>MARKET WORKSPACE</span></div>
      </section>

      <section className="mfx-stats" aria-label="Demo account overview">
        <article><span className="mfx-stat-icon">▣</span><div><small>Demo balance</small><strong>$10,000.00</strong><small className="mfx-muted">Illustrative preview balance</small></div></article>
        <article><span className="mfx-stat-icon">↗</span><div><small>Today's P/L</small><strong className="mfx-profit">+$0.00</strong><small className="mfx-muted">No live account data connected</small></div></article>
      </section>

      <section className="mfx-tools-section" id="features">
        <div className="mfx-section-heading"><div><div className="mfx-kicker">MAMBA FX TOOLS</div><h2>Your platform features</h2></div><span>Choose a workspace to continue</span></div>
        <div className="mfx-tool-grid">
          {tools.map((tool) => <a className="mfx-tool-card" key={tool.title} href={tool.href}><div className="mfx-tool-card-top"><span className="mfx-tool-icon">{tool.icon}</span><span className="mfx-card-arrow">↗</span></div><h3>{tool.title}</h3><small>{tool.subtitle}</small><p>{tool.description}</p>{tool.tag && <span className="mfx-tool-tag">{tool.tag}</span>}<span className="mfx-tool-open">{tool.action} <b>→</b></span></a>)}
        </div>
      </section>

      <section className="mfx-more-features">
        <div className="mfx-kicker">MORE FROM THE ACADEMY</div><h2>Everything you need to keep learning</h2>
        <div className="mfx-more-grid">
          <a href="/terminal"><b>Market Watch</b><span>Explore instruments and market movements</span><i>↗</i></a>
          <a href="/terminal"><b>Charts & Analysis</b><span>Practise chart reading and technical analysis</span><i>↗</i></a>
          <a href="/risk-management"><b>Lot Size Calculator</b><span>Estimate position size before a trade</span><i>↗</i></a>
          <a href="/risk-management"><b>Take Profit & Stop Loss</b><span>Plan exits and understand trade risk</span><i>↗</i></a>
          <a href="/agi-os"><b>Trading Journal</b><span>Build consistent review habits</span><i>↗</i></a>
          <a href="/trading-os"><b>Help & Support</b><span>Get help with your academy account</span><i>↗</i></a>
        </div>
      </section>

      <section className="mfx-community-strip"><div><div className="mfx-kicker">MAMBA FX ACADEMY</div><h2>Strike Fast. Trade Smart.</h2><p>Build knowledge, practise carefully and develop disciplined trading habits.</p></div><a href="mailto:goodcyadesuyi@gmail.com">Contact the academy →</a></section>

      <section className="mfx-account-panel" id="profile"><div><div className="mfx-kicker">YOUR ACCOUNT</div><h2>Profile & settings</h2><p>{user.email}</p><small>Protected by your AuthKit sign-in session.</small></div><div><a href="mailto:goodcyadesuyi@gmail.com">Account help</a><a href="/sign-out">Sign out</a></div></section>

      <nav className="mfx-bottom-nav" aria-label="Main app navigation">
        <a className="active" href="/dashboard"><span>⌂</span>Home</a>
        <a href="/dashboard#features"><span>♧</span>Friends</a>
        <a className="create-nav" href="/dashboard#features"><span>＋</span>Create</a>
        <a href="mailto:goodcyadesuyi@gmail.com"><span>▢</span>Inbox</a>
        <a href="#profile"><span>◉</span>Profile</a>
        <a href="/terminal"><span>↗</span>Trade</a>
      </nav>
      <footer className="mfx-footer">Mamba FX Academy · Educational workspace · Trading involves risk. Live trading is disabled.</footer>
    </main>
  );
}
