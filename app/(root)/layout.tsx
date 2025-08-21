import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
