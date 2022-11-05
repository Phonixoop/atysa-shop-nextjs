import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useAnimation,
} from "framer-motion";

import XIcon from "ui/icons/xicon";
import useKeyPress from "hooks/useKeyPress";
import { useRef } from "react";

function usePrevious(value) {
  const previousValueRef = useRef();

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}
const overlayVariants = {
  visible: {
    opacity: 1,
    // backdropFilter: "blur(2px)",

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

const boxVarients = {
  visible: {
    translateY: "0px",
  },
  hidden: {
    translateY: "10px",
  },
};

export default function Modal({
  children,
  isOpen = false,
  onClose = () => {},
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();

  function onDragEnd(event, info) {
    const shouldClose =
      info.velocity.y > 200 || (info.velocity.y >= 0 && info.point.y > 450);
    if (shouldClose) {
      controls.start("hidden");
      handleClose();
    }
  }

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      controls.start("hidden");
      handleClose();
    } else if (!prevIsOpen && isOpen) {
      controls.start("visible");
    }
  }, [controls, isOpen, prevIsOpen]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    //  setY(modal.current.y);
  }, [isOpen]);

  useKeyPress(() => {
    handleClose();
  }, ["Escape"]);

  function handleClose() {
    document.body.style.overflow = "overlay";
    onClose();
  }

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
                  onClick={handleClose}
                  className="flex justify-center items-end fixed z-[100] inset-0 bg-[#000000a4]"
                >
                  <motion.div
                    initial="hidden"
                    animate={controls}
                    transition={{
                      type: "spring",
                      damping: 30,
                      stiffness: 400,
                    }}
                    variants={boxVarients}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full md:w-1/2 h-5/6 z-[101] overflow-y-auto bg-white flex flex-col justify-center items-center rounded-t-2xl "
                  >
                    <div className="mobileMax:flex hidden w-1/2 h-[5px] bg-gray-300 mt-1 rounded-2xl" />
                    <div className="mobileMin:flex hidden justify-end p-3 items-center w-full">
                      <button onClick={handleClose}>
                        <XIcon />
                      </button>
                    </div>

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
