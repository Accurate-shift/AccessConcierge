import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACCESS Concierge",
  description: "On-demand sourcing and errand concierge.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-access-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
