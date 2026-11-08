import { withAuth } from "@workos-inc/authkit-nextjs";
export default async function Dashboard() {
  const { user } = await withAuth({ ensureSignedIn: true });
  return <main className="wrap"><section className="panel"><div className="brand">Mamba FX Academy</div><div className="eyebrow">Authenticated session</div><h1>Welcome to <span>MFX</span></h1><p>You are signed in through WorkOS AuthKit.</p><div className="user">{user.email}</div><p className="note">This is the secure authentication foundation. Academy lessons, profile, friends, MFX Studio and account settings will be connected to this signed-in area in the next migration stage.</p><a className="secondary" href="/sign-out">Sign out</a></section></main>;
}
