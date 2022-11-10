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
        duration: 0.3,
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
const smallClass = "md:w-[550px] h-2/6";
const meduimClass = "md:w-1/2 h-5/6";
const largeClass = "md:w-11/12 h-5/6";
function getSize(size) {
  switch (size) {
    case "small":
      return smallClass;
    case "medium":
      return meduimClass;
    case "large":
      return largeClass;
    default:
      return meduimClass;
  }
}
export default function Modal({
  children,
  isOpen = false,
  title = "",
  size = "small" | "medium" | "large",
  center = false,
  onClose = () => {},
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();

  const modalSize = getSize(size);
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
                <div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                  onClick={handleClose}
                  className={`${
                    center ? "items-center" : "items-end"
                  } backdrop  flex justify-center items-end fixed z-[100] inset-0 `}
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
                    className={`${modalSize} ${
                      center ? "rounded-2xl" : "rounded-t-2xl"
                    } flex flex-col justify-center items-center gap-0  relative w-full z-[101] overflow-y-auto bg-white  `}
                  >
                    <div className="mobileMax:flex hidden w-1/2 h-[5px] bg-gray-300 mt-1 mb-auto rounded-2xl" />
                    <div className="flex justify-between items-center p-3 w-full pl-[26px]">
                      <p className="flex-1 justify-center items-center text-center">
                        {title}
                      </p>
                      <div className="w-[24px] h-[24px]">
                        <button className="" onClick={handleClose}>
                          <XIcon />
                        </button>
                      </div>
                    </div>

                    {children}
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>,
        document.getElementById("portal")
      )
    : "";
}
