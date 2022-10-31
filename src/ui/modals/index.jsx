import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import XIcon from "@/ui/icons/xicon";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
  }, [isOpen]);

  useKeyPress(() => {
    console.log(isOpen);
    if (isOpen) onClose();
  }, ["Escape"]);

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
                  className="fixed z-[100] inset-0"
                >
                  <motion.div
                    className="absolute z-[99] inset-0 overflow-y-auto"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={boxVarients}
                    onClick={(e) => onClose()}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-6 flex-col justify-center items-center  bg-gray-100  w-11/12 md:w-6/12 h-5/6 absolute z-[200] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  rounded-xl overflow-hidden "
                    >
                      <div className="flex justify-end p-3 items-center w-full">
                        <button onClick={() => onClose()}>
                          <XIcon />
                        </button>
                      </div>
                      {children}
                    </div>
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
