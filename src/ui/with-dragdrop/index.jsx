import { useRef, useState } from "react";

export default function withDragDrop(Component) {
  return function WrappedComponent({ children, onDrop = () => {}, ...rest }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const ref = useRef(undefined);

    function handleDragOver(e) {
      e.preventDefault();
      setIsDragOver(true);
    }

    function handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      handleFile([...e.dataTransfer.files]);
    }

    function handleFile(files) {
      console.log(files);
      if (!files) return;
      const _files = files?.map((file) => {
        const { name } = file;
        return {
          id: Math.random() * 1e9,
          originalFilename: name,
          details: file,
          url: window.URL.createObjectURL(file),
          uploaded: false,
        };
      });

      onDrop(_files);
    }

    return (
      <>
        <div
          className="w-full text-center py-2 border-[1px] border-dashed border-gray-400 rounded-xl cursor-pointer"
          onClick={() => {
            ref.current.click();
          }}
        >
          انتخاب فایل
        </div>
        <div
          dir="ltr"
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`${
            isDragOver ? "bg-atysa-400 bg-opacity-75" : ""
          } flex flex-row flex-wrap justify-center gap-2 p-2 overflow-y-auto items-center w-full h-full border-[1px] border-dashed border-gray-400 rounded-xl`}
        >
          {children}
          <input
            ref={ref}
            hidden
            type="file"
            multiple
            onChange={(e) => {
              handleFile([...e.target.files]);
            }}
          />
          <Component {...rest} />
        </div>
      </>
    );
  };
}
