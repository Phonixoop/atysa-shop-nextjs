import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const overlayVariants = {
  visible: {
    opacity: 1,
    // backdropFilter: "blur(20px)",

    transition: {
      when: "beforeChildren",
      opacity: {
        duration: 0,
        delay: 0,
      },
    },
  },
  hidden: {
    opacity: 0,
    // backdropFilter: "blur(0px)",
    transition: {
      when: "afterChildren",
      duration: 0,
    },
  },
};

export default function Toast({ children, className = "", isOpen = false }) {
  const [bgColor, setBgColor] = useState("");

  const [mounted, setMounted] = useState(false);
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);
  return mounted
    ? ReactDOM.createPortal(
        <>
          <AnimatePresence mode="wait">
            {isOpen && (
              <>
                <motion.div
                  dir="rtl"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                  className={`min-h-24 fixed bottom-10 left-1/2 z-[1000000] w-80 -translate-x-1/2 rounded-xl px-5 py-2  ${className}  backdrop-blur`}
                >
                  {children}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>,
        document.getElementById("toast")
      )
    : "";
}
