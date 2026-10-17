import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { business } from "@/lib/business";
import "./globals.css";

export const metadata: Metadata = {
  title: `${business.name} | ${business.tagline}`,
  description: `${business.slogan}. Manual and automatic car training and all RTO work and consultation in ${business.branches.map((branch) => branch.location).join(" and ")}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
