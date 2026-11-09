import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Spotify Data Explorer",
    template: "%s | Spotify Data Explorer",
  },
  description:
    "Explore and visualize Spotify data from the 2023 and 2024 datasets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <SidebarProvider defaultOpen>
          <AppSidebar />

          <SidebarInset className="min-w-0">
            <AppHeader />

            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
