import ReactDOM from "react-dom";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRef } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useAnimation,
} from "framer-motion";

import XIcon from "ui/icons/xicon";
import useKeyPress from "hooks/useKeyPress";

import ChevronLeftIcon from "ui/icons/chervons/chevron-left";

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

const boxVarients = {
  visible: {
    translateY: "0px",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 1000,
    },
  },
  hidden: {
    translateY: "30px",
  },
};
const siezes = [
  {
    label: "xs",
    class: "md:w-[350px] md:h-1/6",
  },
  {
    label: "sm",
    class: "md:w-[550px] md:h-2/6",
  },
  {
    label: "md",
    class: "md:min-w-[50%] md:w-fit w-full md:h-5/6",
  },
  {
    label: "lg",
    class: "md:w-11/12 md:h-5/6",
  },
];
const smallClass = "md:w-[550px] "; //max-h-2/6
const meduimClass = "md:w-1/2 "; //max-h-5/6
const largeClass = "md:w-11/12 "; // max-h-5/6
function getSize(size) {
  return siezes.filter((item) => item.label === size).map((a) => a.class);
}

const BREAK_POINT = 700;
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
  const windowSize = useWindowSize();
  const prevIsOpen = usePrevious(isOpen);
  const boxRef = useRef();
  const controls = useAnimation();
  const [top, setTop] = useState(true);
  const modalSize = getSize(size);
  const dragControls = useDragControls();

  const isOnMobile = windowSize.width <= BREAK_POINT;
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
    else document.body.style.overflow = "overlay";
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
    if (info.offset.y > 260) {
      handleClose();
    }
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
                  className={`${
                    center ? "laptopMin:items-center" : "items-end"
                  } backdrop overflow-overlay  flex justify-center items-end fixed z-[100] inset-0 `}
                >
                  <motion.div
                    ref={boxRef}
                    initial="hidden"
                    animate="visible"
                    // dragControls={dragControls}
                    variants={boxVarients}
                    // drag="y"
                    // dragConstraints={{
                    //   top: 0, //-window.screen.height / 2 + 120
                    //   bottom: 0,
                    // }}
                    // dragElastic={0.8}
                    // onDragEnd={handleDragEnd}
                    onTouchStart={(e) => {
                      dragControls.start(e, { dragListener: true });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`${modalSize} ${
                      center ? "mobileMin:rounded-2xl" : "rounded-t-2xl"
                    }  flex flex-col justify-center items-center gap-0  relative  z-[101] h-full  bg-white overflow-hidden `}
                    // h-auto top-52
                  >
                    <div
                      className={`sticky top-[0px] flex flex-col justify-center items-center w-full h-auto bg-white  overflow-hidden z-20`}
                    >
                      {/* <div className="mobileMax:flex hidden w-1/2 h-[10px] bg-gray-300 mt-1 mb-auto rounded-2xl" /> */}
                      <div
                        className={`flex justify-between items-center p-4 w-full ${
                          !isOnMobile ? "pl-[26px]" : "pr-[26px]"
                        }`}
                      >
                        {isOnMobile && (
                          <div className="w-[24px] h-[24px]">
                            <button className="" onClick={handleClose}>
                              <ChevronLeftIcon />
                            </button>
                          </div>
                        )}
                        <p className="flex-1 justify-center items-center text-center">
                          {title}
                        </p>
                        {!isOnMobile && (
                          <div className="w-[24px] h-[24px]">
                            <button className="" onClick={handleClose}>
                              <XIcon />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <motion.div
                      onTouchStartCapture={(e) => {
                        dragControls.start(e, { dragListener: false });
                      }}
                      className="w-full h-full p-0 m-0 overflow-y-auto"
                    >
                      {children}
                    </motion.div>
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
