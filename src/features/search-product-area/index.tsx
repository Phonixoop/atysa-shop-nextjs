import SearchProduct from "features/search-product";
import React, { useState } from "react";
import SearchIcon from "ui/icons/searchs";
import Overlay from "ui/overlay";

export default function SearchArea() {
  const [overlay, setOverlay] = useState({
    isOpen: false,
    value: "",
  });
  return (
    <>
      <SearchBox
        disabled
        value={overlay.value}
        onClick={() => {
          setOverlay((prev) => {
            return {
              ...prev,
              isOpen: true,
            };
          });
        }}
      />
      <Overlay
        className="fixed top-0 left-0 z-50 flex h-screen w-screen items-start justify-center bg-gray-600/80  backdrop-blur-md md:backdrop-blur-[2px]"
        isOpen={overlay.isOpen}
        onClose={() =>
          setOverlay((prev) => {
            return {
              ...prev,
              isOpen: false,
            };
          })
        }
      >
        <div
          className="flex h-full flex-col items-center justify-start gap-2  p-5 md:min-w-[20rem]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SearchBox
            value={overlay.value}
            onChange={(value) => {
              setOverlay((prev) => {
                return {
                  ...prev,
                  value,
                };
              });
            }}
          />
          <SearchProduct
            query={overlay.value}
            className="flex w-full flex-col items-center justify-start gap-5 pb-32"
          />
        </div>
      </Overlay>
    </>
  );
}

function SearchBox({
  value,
  disabled = false,
  onChange,
  onClick,
}: {
  value?: string;
  disabled?: boolean;
  onChange?: (e) => void;
  onClick?: () => void;
}) {
  return (
    <>
      <button
        className="z-[60] flex w-full cursor-text rounded-xl  bg-gray-50 md:min-w-[20rem] "
        onClick={onClick}
      >
        <div className="flex w-full cursor-text items-center justify-end gap-3  rounded-2xl px-4 py-3  caret-atysa-secondry md:flex-grow ">
          <input
            autoFocus
            disabled={disabled}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full cursor-text bg-transparent text-right placeholder-gray-400 outline-none"
            placeholder="جستجو محصول"
          />
          <span className="h-4 w-[1px] cursor-text bg-gray-400"></span>
          <SearchIcon className="h-4 w-4 cursor-text fill-gray-400" />
        </div>
      </button>
    </>
  );
}
