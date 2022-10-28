import React from "react";
import { experimental_use as use, Suspense } from "react";

export default function myuse() {
  return (
    <Suspense>
      <div>myuse</div>
    </Suspense>
  );
}
