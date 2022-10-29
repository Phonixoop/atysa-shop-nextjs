import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useKeyPress from "@/hooks/useKeyPress";
const overlayVariants = {
  visible: {
    opacity: 1,
    backgroundColor: "#000000a4",
    // backdropFilter: "blur(2px)",

    transition: {
      when: "beforeChildren",
      opacity: {
        duration: 0,
        delay: 0,
      },
      backdropFilter: {
        duration: 10,
        delay: 5,
      },
      backgroundColor: {
        duration: 10,
        delay: 5,
      },
    },
  },
  hidden: {
    opacity: 0,
    backgroundColor: "#00000099",
    backdropFilter: "blur(0px)",
    transition: {
      when: "afterChildren",
      duration: 0,
      backdropFilter: {
        duration: 0,
        delay: 0,
      },
    },
  },
};

const boxVarients = {
  visible: {
    y: "0",
  },
  hidden: {
    y: "1vh",
  },
};

export default function Modal({
  children,
  isOpen = false,
  onClose = () => {},
  className = "",
}) {
  useKeyPress(() => onClose(), ["Escape"]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
  }, [isOpen]);
  return mounted
    ? ReactDOM.createPortal(
        <>
          <AnimatePresence mode="wait">
            {isOpen && (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                  onClick={() => {
                    document.body.style.overflow = "overlay";
                    onClose();
                  }}
                  className="fixed z-[100] inset-0 "
                >
                  <motion.div
                    className="absolute z-[99] inset-0 overflow-y-auto"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={boxVarients}
                    onClick={(e) => onClose()}
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>,
        document.getElementById("portal")
      )
    : "";
}
