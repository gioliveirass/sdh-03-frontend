import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { SocketProvider } from "@/context/SocketContext";

import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk To Me!",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning={true}
        className={`${rubik.className} text-white bg-black`}
      >
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
