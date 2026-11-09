import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

const sections = [
  { title: "Members", detail: "Review member accounts and access", icon: "♙", status: "Connect member database" },
  { title: "Courses & lessons", detail: "Organise lessons and video courses", icon: "▤", status: "Content management setup" },
  { title: "MFX Studio", detail: "Review posts, stories and uploads", icon: "＋", status: "Moderation tools setup" },
  { title: "Community", detail: "Friends, reports and member safety", icon: "♧", status: "Community service setup" },
  { title: "Inbox & support", detail: "Member messages and support requests", icon: "✉", status: "Messaging integration setup" },
  { title: "Membership & payments", detail: "Review membership records and payment status", icon: "＄", status: "Payment provider integration required" },
  { title: "Website settings", detail: "Manage academy configuration", icon: "⚙", status: "Configuration setup" },
];

export default async function AdminPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const email = (user.email || "").trim().toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !admins.includes(email)) redirect("/dashboard");

  const name = user.firstName || "Administrator";

  return (
    <main style={{ minHeight: "100vh", background: "#0b1118", color: "#f4f1e8", padding: "28px 18px 48px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", borderBottom: "1px solid #29333d", paddingBottom: 22 }}>
          <a href="/dashboard" style={{ color: "#e6bd58", textDecoration: "none", fontWeight: 800, letterSpacing: 1 }}>MAMBA FX <span style={{ color: "#f4f1e8" }}>ACADEMY</span></a>
          <div style={{ display: "flex", gap: 14, alignItems: "center", color: "#b8c1c9", fontSize: 13 }}>
            <span>Admin: {email}</span><a href="/sign-out" style={{ color: "#e6bd58" }}>Sign out</a>
          </div>
        </header>

        <section style={{ padding: "34px 0 24px" }}>
          <div style={{ color: "#e6bd58", fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>SECURE CONTROL CENTRE</div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", margin: "10px 0", letterSpacing: -1 }}>Welcome, {name}</h1>
          <p style={{ color: "#aab5bf", margin: 0, lineHeight: 1.6 }}>Manage the Mamba FX Academy platform from one place.</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, margin: "12px 0 30px" }}>
          {[
            ["Platform", "Admin access protected", "Your account passed the admin allowlist check"],
            ["Member records", "Not connected", "Connect a database before showing live counts"],
            ["Payments", "Not connected", "Connect a payment provider for verified records"],
          ].map(([label, value, note]) => (
            <article key={label} style={{ background: "#141e28", border: "1px solid #2b3945", borderRadius: 16, padding: 18 }}>
              <div style={{ color: "#aab5bf", fontSize: 12 }}>{label}</div>
              <div style={{ color: "#e6bd58", fontSize: 19, fontWeight: 700, margin: "10px 0 6px" }}>{value}</div>
              <div style={{ color: "#8996a2", fontSize: 12, lineHeight: 1.5 }}>{note}</div>
            </article>
          ))}
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div><div style={{ color: "#e6bd58", fontSize: 11, letterSpacing: 2, fontWeight: 800 }}>MANAGEMENT</div><h2 style={{ margin: "7px 0 0", fontSize: 24 }}>Academy operations</h2></div>
          <a href="/dashboard" style={{ color: "#e6bd58", fontSize: 13 }}>← Member dashboard</a>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 14 }}>
          {sections.map((item) => (
            <article key={item.title} style={{ background: "#141e28", border: "1px solid #2b3945", borderRadius: 16, padding: 20 }}>
              <div style={{ color: "#e6bd58", fontSize: 25 }}>{item.icon}</div>
              <h3 style={{ margin: "12px 0 7px", fontSize: 17 }}>{item.title}</h3>
              <p style={{ color: "#aab5bf", fontSize: 13, lineHeight: 1.5, minHeight: 39 }}>{item.detail}</p>
              <div style={{ borderTop: "1px solid #2b3945", paddingTop: 12, color: "#e6bd58", fontSize: 11 }}>{item.status}</div>
            </article>
          ))}
        </section>

        <aside style={{ marginTop: 24, padding: 18, borderRadius: 14, background: "#201d14", border: "1px solid #6b5728", color: "#d8c99f", fontSize: 13, lineHeight: 1.65 }}>
          <strong style={{ color: "#f0c75e" }}>Setup notice:</strong> This is the secure admin interface foundation. Live member lists, editing, moderation, analytics and payment records will only work after their database and service integrations are connected. No sample figures or fake payment records are displayed.
        </aside>
        <footer style={{ color: "#71808c", fontSize: 12, marginTop: 28 }}>Mamba FX Academy · Administrator workspace · Trading involves risk.</footer>
      </div>
    </main>
  );
}
