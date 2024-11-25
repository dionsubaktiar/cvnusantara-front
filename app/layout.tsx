import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/provider";

export const metadata: Metadata = {
  title: "Nusantara Trans Sentosa",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
