import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

const themeInit = `
(function(){
  try {
    var k = 'apple-task-tracker-theme';
    var t = localStorage.getItem(k);
    var d = document.documentElement;
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      d.setAttribute('data-theme', 'dark');
    else d.setAttribute('data-theme', 'light');
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "Tasks",
  description: "A calm, Apple-style task tracker",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
