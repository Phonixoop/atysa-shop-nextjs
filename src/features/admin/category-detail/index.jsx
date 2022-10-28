import React from "react";

export default function CategoryDetail({ form }) {
  return (
    <div className="flex flex-grow w-full justify-center overflow-y-auto">
      <div className="flex flex-1 p-10 flex-grow justify-center items-start ">
        <MyForm {...{ form }} />
      </div>
    </div>
  );
}
