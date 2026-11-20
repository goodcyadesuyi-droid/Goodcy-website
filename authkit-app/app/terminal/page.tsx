import "./terminal.css";
import { withAuth } from "@workos-inc/authkit-nextjs";
import TerminalClient from "./terminal-client";

export default async function TradingTerminalPage() {
  await withAuth({ ensureSignedIn: true });
  return <TerminalClient />;
}
