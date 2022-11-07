import { useEffect, useState } from "react";
export default function useScroll() {
  const [isGoingUp, setIsGoingUp] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  function checkScrollDirection(event) {
    if (scrollPos < window.scrollY) {
      setIsGoingUp(false);
    } else {
      setIsGoingUp(true);
    }
    setScrollPos(window.scrollY);
  }

  useEffect(() => {
    if (typeof window == "undefined") return;
    window.onscroll = checkScrollDirection;

    return () => {
      window.onscroll = undefined;
      window.removeEventListener("onscroll", checkScrollDirection);
    };
  }, []);

  return isGoingUp;
}
