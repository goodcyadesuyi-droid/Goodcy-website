const programmes = [
  { number: "01", title: "Forex foundations", description: "Understand currency pairs, pips, spreads, sessions and how the foreign-exchange market works." },
  { number: "02", title: "Market analysis", description: "Learn the basics of chart reading, technical analysis and the economic events that move markets." },
  { number: "03", title: "Risk & trading psychology", description: "Study position sizing, stop-loss planning, discipline and the emotional side of trading." },
];

export default function Home() {
  return (
    <main className="public-site">
      <header className="public-header">
        <a className="public-wordmark" href="#top" aria-label="Mamba FX Academy home">
          
          <span>MAMBA FX <b>ACADEMY</b></span>
        </a>
        <nav className="public-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#learning">Learning</a>
          <a href="/trading-os">AI Trading OS</a>
          <a href="#leadership">Leadership</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="public-login" href="/sign-in">Student sign in</a>
      </header>

      <section className="public-hero" id="top">
        <div className="public-hero-copy">
          <div className="public-eyebrow"><span /> ONLINE FOREX EDUCATION · NIGERIA</div>
          <h1>Learn the market.<br /><em>Build your discipline.</em></h1>
          <p className="public-lead">A learning home for people who want to understand forex, develop market knowledge and approach trading with a plan.</p>
          <div className="public-actions">
            <a className="public-cta" href="#learning">Explore learning <span>↗</span></a>
            <a className="public-secondary" href="/sign-in">Student sign in</a>
          </div>
          <p className="public-disclaimer">Education first. Markets involve risk. No trading outcome is guaranteed.</p>
        </div>
        <div className="public-hero-art" aria-label="Mamba FX Academy brand artwork">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-glow" />
          <div className="hero-art-inner">
            <span className="hero-art-kicker">MAMBA FX</span>
            <span className="hero-art-title">ACADEMY</span>
            <span className="hero-art-rule" />
            <span className="hero-art-tag">LEARN · TRADE · PROFIT</span>
          </div>
          <span className="hero-art-index">01 / LEARN</span>
        </div>
      </section>

      <section className="public-trust-strip" aria-label="Academy focus">
        <span>FOREX FUNDAMENTALS</span><i />
        <span>MARKET EDUCATION</span><i />
        <span>RISK AWARENESS</span><i />
        <span>TRADING DISCIPLINE</span>
      </section>

      <section className="public-section public-about" id="about">
        <div className="public-section-label">01 / ABOUT THE ACADEMY</div>
        <div className="public-about-grid">
          <h2>Knowledge before<br /><em>every trade.</em></h2>
          <div>
            <p>Mamba FX Academy is a Nigeria-based online forex education brand founded by Adesuyi Goodness and Adesuyi Mercy. We are building a learning environment focused on understanding the foreign-exchange market, responsible trading habits and continuous learning.</p>
            <p>Our approach puts education, realistic expectations and risk awareness at the centre of the learning journey.</p>
          </div>
        </div>
      </section>

      <section className="public-section public-learning" id="learning">
        <div className="public-section-heading">
          <div><div className="public-section-label">02 / LEARNING AREAS</div><h2>Build your <em>foundation.</em></h2></div>
          <p>Explore the core subjects that shape an informed approach to forex markets.</p>
        </div>
        <div className="public-programmes">
          {programmes.map((item) => (
            <article className="public-programme" key={item.number}>
              <span className="programme-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
              <span className="programme-arrow">↗</span>
            </article>
          ))}
        </div>
        <p className="public-coming-note">Learning resources are being prepared. Sign in to access the member area.</p>
      </section>

      <section className="public-section public-leadership" id="leadership">
        <div className="public-section-label">03 / LEADERSHIP</div>
        <h2>Meet the <em>leadership.</em></h2>
        <div className="public-leaders">
          <article className="public-leader"><span className="leader-initials">AG</span><div><h3>Adesuyi Goodness</h3><p>Co-Founder & Co-CEO</p></div></article>
          <article className="public-leader"><span className="leader-initials">AM</span><div><h3>Adesuyi Mercy</h3><p>Co-Founder & Co-CEO</p></div></article>
          <article className="public-leader"><span className="leader-initials">MFX</span><div><h3>Mamba FX</h3><p>Assistant CEO</p></div></article>
        </div>
      </section>

      <section className="public-contact" id="contact">
        <div><div className="public-section-label">04 / GET IN TOUCH</div><h2>Start with <em>knowledge.</em></h2><p>For academy enquiries and information, contact our team.</p></div>
        <div className="contact-details"><a href="mailto:goodcyadesuyi@gmail.com">goodcyadesuyi@gmail.com</a><span>Nigeria · Online academy</span><a className="contact-login" href="/sign-in">Student sign in ↗</a></div>
      </section>

      <footer className="public-footer">
        <a className="public-wordmark" href="#top"><span className="public-monogram">MFX</span><span>MAMBA FX <b>ACADEMY</b></span></a>
        <span>© {new Date().getFullYear()} Mamba FX Academy</span>
        <span>Forex education · Trading involves risk</span>
      </footer>
      <div className="public-risk">Risk disclosure: Forex and leveraged trading carry a high level of risk and may not be suitable for everyone. Educational material is not personal financial advice. Never trade money you cannot afford to lose. No profit or trading result is promised.</div>
    </main>
  );
}
