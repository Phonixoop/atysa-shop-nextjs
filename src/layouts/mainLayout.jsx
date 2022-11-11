import React from "react";
// featuer layouts
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import { motion } from "framer-motion";
const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
        className="flex flex-grow w-full h-full "
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
