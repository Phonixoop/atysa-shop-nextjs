import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
export default function ContextMenu({ children, show, onLeave = () => {} }) {
  const [anchorPoint, setAnchorPoint] = useState({ X: 0, Y: 0 });
  const ref = useRef(undefined);
  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setAnchorPoint({ X: event.pageX, Y: event.pageY });
    },
    [onLeave, setAnchorPoint]
  );

  const handleClick = useCallback(() => {
    if (ref.current && !ref.current.contains(event.target)) {
      return show ? onLeave() : undefined;
    }
  }, [show]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return (
    <>
      {show && (
        <motion.div
          ref={ref}
          initial={{ borderRadius: 50 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 400,
          }}
          layout
          style={{
            left: anchorPoint?.X - ref.current?.offsetWidth / 2,
            top: anchorPoint?.Y - 10,
          }}
          className={`fixed w-auto h-auto bg-transparent rounded-lg`}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
