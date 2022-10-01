import React from "react";
// featuer layouts
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex flex-grow w-full h-full ">{children}</main>
      <Footer />
    </>
  );
}
