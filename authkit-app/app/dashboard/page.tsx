import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Dashboard() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const displayName = user.firstName || user.email?.split("@")[0] || "Trader";

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="/dashboard"><span className="brand-mark">MFX</span><span>MAMBA FX <b>ACADEMY</b></span></a>
        <a className="avatar" href="#profile" aria-label="Your profile">{displayName.slice(0,1).toUpperCase()}</a>
      </header>
      <section className="welcome">
        <div className="eyebrow">MEMBER WORKSPACE</div>
        <h1>Welcome back, <span>{displayName}</span></h1>
        <p>Your trading education and MFX community, in one place.</p>
      </section>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#home">Home</a><a href="#friends">Friends</a><a href="#studio">＋ Create</a><a href="#inbox">Inbox</a><a href="#profile">Profile</a>
      </nav>
      <section id="home" className="content-grid">
        <article className="feature-card">
          <div className="eyebrow">MAMBA FX ACADEMY</div>
          <h2>Learn with discipline.<br/><span>Trade with a plan.</span></h2>
          <p>Build your knowledge with structured lessons, market concepts and risk-management practice.</p>
          <a className="gold-button" href="#learning">Explore learning</a>
        </article>
        <article id="learning" className="tile">
          <div className="tile-icon">↗</div><h3>Learning centre</h3><p>Trading lessons and practice materials.</p><span className="coming">Content setup next</span>
        </article>
        <article id="friends" className="tile">
          <div className="tile-icon">♧</div><h3>Friends</h3><p>Find fellow learners and build your trading community.</p><span className="coming">Community preview</span>
        </article>
        <article id="studio" className="tile">
          <div className="tile-icon">＋</div><h3>MFX Studio</h3><p>Plan a post, share a learning update or prepare a short video.</p><a className="text-link" href="#studio-note">Open studio area →</a>
        </article>
        <article id="inbox" className="tile">
          <div className="tile-icon">✉</div><h3>Inbox</h3><p>Your member messages and academy notifications.</p><span className="coming">Messaging setup next</span>
        </article>
      </section>
      <section id="studio-note" className="lower-panel">
        <div><div className="eyebrow">CREATE</div><h2>MFX Studio</h2><p>Studio publishing is a preview until media storage and community services are connected.</p></div>
        <a className="outline-button" href="#profile">View profile</a>
      </section>
      <section id="profile" className="lower-panel profile-panel">
        <div><div className="eyebrow">YOUR ACCOUNT</div><h2>Profile & settings</h2><p className="account-email">{user.email}</p><p>Account access is protected by your WorkOS AuthKit session.</p></div>
        <div className="account-actions"><a className="outline-button" href="mailto:support@mambafxacademy.com?subject=Account%20settings">Account help</a><a className="signout" href="/sign-out">Sign out</a></div>
      </section>
      <footer className="app-footer">Mamba FX Academy · Educational content only. Trading involves risk.</footer>
    </main>
  );
}
