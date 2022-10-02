import { useState } from "react";

import UserAreaMenu from "./";

export default function UserArea() {
  const user = undefined;
  //const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return <div></div>;
}
