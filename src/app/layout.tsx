import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MochaTrade Unified Incident Command Portal",
  description: "Real-time Incident Response Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="mode-alert">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@400;600;700&family=Chivo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="ambient-background-layer" />
        <div id="mesh-blobs-layer">
          <div className="mesh-blob blob-crimson-top" />
          <div className="mesh-blob blob-orange-topright" />
          <div className="mesh-blob blob-pink-midleft" />
          <div className="mesh-blob blob-amber-center" />
          <div className="mesh-blob blob-crimson-bottomleft" />
          <div className="mesh-blob blob-magenta-bottomright" />
        </div>
        <canvas id="mystical-orbs-canvas" />
        {children}
      </body>
    </html>
  );
}