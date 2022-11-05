import React, { useRef, useState } from "react";
import AdminLayout from "layouts/adminLayout";
export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInput = useRef(undefined);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Object.values(e.dataTransfer.files);
    handleFile(files);
  }

  function handleFile(_files) {
    const files = _files.map((file) => {
      const { name } = file;
      return {
        name,
        details: file,
        url: window.URL.createObjectURL(file),
      };
    });

    setFiles((prev) => {
      return [...prev, ...files];
    });

    //     lastModified
    // :
    // 1665245380180
    // lastModifiedDate
    // :
    // Sat Oct 08 2022 19:39:40 GMT+0330 (Iran Standard Time) {}
    // name
    // :
    // "wallet-trans.png"
    // size
    // :
    // 190211
    // type
    // :
    // "image/png"
    // webkitRelativePath
    // :
    // ""
  }

  return (
    <div className="w-11/12 h-5/6 flex flex-col gap-2">
      <div className="w-full h-20 border-[1px] border-dashed border-gray-400 rounded-lg"></div>
      <div
        dir="ltr"
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => handleDrop(e)}
        className={`${
          isDragOver ? "bg-atysa-400 bg-opacity-75" : ""
        } flex flex-row flex-wrap justify-start gap-2 p-2 overflow-y-auto items-start w-full h-full border-[1px] border-dashed border-gray-400 rounded-xl`}
      >
        <input
          type="file"
          ref={fileInput}
          hidden
          multiple
          onChange={(e) => handleFile(e.target.files)}
        />
        {files.length > 0 &&
          files.map((file) => {
            return (
              <div className="flex justify-center drop-shadow-lg items-center w-40 h-40 overflow-hidden">
                {file.details.type.includes("image") ? (
                  <img src={file.url} alt="image" className=" rounded-xl" />
                ) : (
                  <span>{file.name}</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

GalleryPage.PageLayout = AdminLayout;
