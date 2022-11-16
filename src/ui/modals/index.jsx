import React, { useEffect, useLayoutEffect, useState } from "react";
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
const siezes = [
  {
    label: "xs",
    class: "md:w-[350px] h-1/6",
  },
  {
    label: "sm",
    class: "md:w-[550px] h-2/6",
  },
  {
    label: "md",
    class: "md:w-1/2 h-5/6",
  },
  {
    label: "lg",
    class: "md:w-11/12 h-5/6",
  },
];
const smallClass = "md:w-[550px] "; //max-h-2/6
const meduimClass = "md:w-1/2 "; //max-h-5/6
const largeClass = "md:w-11/12 "; // max-h-5/6
function getSize(size) {
  return siezes.filter((item) => item.label === size).map((a) => a.class);
}
export default function Modal({
  children,
  isOpen = false,
  title = "",
  size = "md",
  center = false,
  onClose = () => {},
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();
  const [top, setTop] = useState(true);
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
    setTop(`-top-['${window.screen.height}']`);
  }, []);
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
  function handleDragEnd(event, info) {
    if (info.offset.y > 160) {
      handleClose();
    }
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
                    center ? "laptopMin:items-center" : "items-end"
                  } backdrop overflow-auto flex justify-center items-end fixed z-[100] inset-0 `}
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
                    drag="y"
                    dragConstraints={{
                      top: 0, //-window.screen.height / 2 + 120
                      bottom: 0,
                    }}
                    dragElastic={0.8}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => e.stopPropagation()}
                    className={`${modalSize} ${
                      center ? "rounded-2xl" : "rounded-t-2xl"
                    } h-auto translate-y-72 flex flex-col justify-center items-center gap-0  relative w-full z-[101]  bg-white  `}
                  >
                    <div
                      className={`w-full h-auto bg-white rounded z-20 sticky -top-[290px]`}
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
                    </div>

                    <motion.div
                      drag="y"
                      dragConstraints={{
                        top: 0,
                        bottom: 0,
                      }}
                      dragElastic={0}
                      className="w-full h-full p-0 m-0 overflow-y-auto"
                    >
                      {children}
                    </motion.div>
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
