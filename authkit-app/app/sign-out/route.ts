import { signOut } from "@workos-inc/authkit-nextjs";
export async function GET() {
  const returnTo = new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString();
  await signOut({ returnTo });
}
