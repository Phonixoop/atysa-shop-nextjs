import React from "react";
import { Scrollbar } from "smooth-scrollbar-react";

export default function MePage() {
  return (
    <div className="flex h-[150vh]">
      {" "}
      <Scrollbar
        plugins={{
          overscroll: {
            effect: "glow",
          },
        }}
      >
        a
      </Scrollbar>
    </div>
  );
}
