import React from "react";
// featuer layouts
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import AdminBar from "features/admin-bar";
import { motion } from "framer-motion";
const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
};

export default function MainLayout({ children }) {
  return (
    <>
      <AdminBar />
      <Header />
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
        className="flex flex-grow w-full h-full"
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
