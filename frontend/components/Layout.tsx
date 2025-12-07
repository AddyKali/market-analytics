import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();

  const linkClass = (path: string) =>
    router.pathname === path ? "nav-link-active" : "";

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-title">📊 Market Analytics & Risk</div>
        <div className="nav-links">
          <Link href="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link href="/portfolio" className={linkClass("/portfolio")}>
            Portfolio
          </Link>
          <Link href="/risk" className={linkClass("/risk")}>
            Risk
          </Link>
        </div>
      </nav>

      <main className="container">{children}</main>
    </div>
  );
}
