import { useEffect } from "react";

export default function useKeyPress(callback, keyCodes) {
  const handler = ({ code }) => {
    if (keyCodes.includes(code)) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}
