import type { Metadata } from "next";
import { profile } from "../content/profile";
import { pageMetadata, siteOrigin } from "../content/seo";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  ...pageMetadata(
    "Sasiru Vishmika — Software, Cloud & Infrastructure",
    "Software engineering foundation with a focus on cloud infrastructure, DevOps, networking and security. Explore source-backed engineering case studies.",
    "/",
  ),
  title: {
    default: "Sasiru Vishmika — Software, Cloud & Infrastructure",
    template: "%s | Sasiru Vishmika",
  },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <a className="brand" href="/" aria-label="Sasiru Vishmika home">
              <span className="brand-symbol" aria-hidden="true">
                sv.
              </span>
              <span>
                Sasiru Vishmika
                <span className="brand-detail">
                  SOFTWARE / CLOUD / INFRASTRUCTURE
                </span>
              </span>
            </a>
            <nav aria-label="Main navigation">
              <a href="/#work">Work</a>
              <a href="/#domains">Domains</a>
              <a href="/#about">About</a>
              <a className="nav-contact" href="/#contact">
                Let’s talk <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer container">
          <p>© Sasiru Vishmika</p>
          <span className="mono">ENGINEERED WITH INTENT.</span>
          <a href={profile.github}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="#main">Back to top ↑</a>
        </footer>
      </body>
    </html>
  );
}
