import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heimahjúkrun Akureyri",
  description: "Home care services in Akureyri",
  icons: {
    icon: "/homeVital.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/homeVital.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body
        className={`${openSans.className} antialiased flex flex-col h-screen bg-banner`}
        data-pw-cursor="pointer"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
