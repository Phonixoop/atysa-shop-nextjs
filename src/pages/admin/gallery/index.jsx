import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "layouts/adminLayout";
import { motion } from "framer-motion";
import { uploadFile } from "api";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { getUploads } from "api";
import Image from "next/image";
export default function GalleryPage() {
  const { data, isLoading, refetch } = useQuery(
    ["gallery"],
    () => getUploads(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const [files, setFiles] = useState(
    data?.map(({ id, mimetype, url, size, originalFilename, newFilename }) => {
      return {
        id,
        details: {
          type: mimetype,
        },
        url,
        originalFilename,
        newFilename,
        size,
      };
    }) || []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(undefined);
  const ref = useRef(undefined);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFile(e);
  }

  async function handleFile(e) {
    const _files = Object.values(e.target.files || e.dataTransfer.files);
    if (!_files) return;
    const files = _files.map((file) => {
      const { name } = file;
      return {
        id: Math.random() * 1e9,
        originalFilename: name,
        details: file,
        url: window.URL.createObjectURL(file),
      };
    });

    setFiles((prev) => {
      return [...files, ...prev];
    });

    await new Promise((resolve) => {
      _files.map(async (file) => {
        await uploadFile(file, (percentage) => {
          console.log(percentage);
        });
      });
      resolve();
    });

    refetch();
  }

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);
  return (
    <>
      <div className="w-11/12 h-5/6 flex flex-col gap-2">
        <div
          className={`w-full h-20 border-[1px] border-dashed border-gray-400 rounded-lg`}
        >
          <input
            ref={ref}
            type="file"
            //  value={"dsad.png,asdasd.png"}

            multiple
            onChange={handleFile}
          />
        </div>
        <div
          dir="ltr"
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`${
            isDragOver ? "bg-atysa-400 bg-opacity-75" : ""
          } flex flex-row flex-wrap justify-start gap-2 p-2 overflow-y-auto items-start w-full h-full border-[1px] border-dashed border-gray-400 rounded-xl`}
        >
          {files != null &&
            files.length > 0 &&
            files.map((file) => {
              return (
                <File
                  file={file}
                  onChange={(file) => setSelectedFileId(file.id)}
                />
              );
            })}
        </div>

        <Menu
          show={!!selectedFileId}
          onLeave={() => setSelectedFileId(undefined)}
        >
          <div className="w-48 h-full p-1 bg-[#000000b3] backdrop-blur-sm rounded-xl overflow-hidden select-none ">
            <ul className="flex flex-col gap-1">
              <li className="bg-inherit text-white w-full h-full p-2 transition-colors  shadow-xl border-b-[1px] border-dashed duration-200">
                {files.map((a) => {
                  if (a.id == selectedFileId) return a.originalFilename;
                })}
              </li>
              <motion.li
                whileTap={{
                  scale: 0.9,

                  backgroundColor: "ThreeDShadow",
                  transition: { duration: 0.1 },
                }}
                className="bg-inherit text-green-600 hover:bg-[#000000b2] w-full h-full cursor-pointer  p-2 transition-colors rounded-xl duration-200"
              >
                ویرایش
              </motion.li>
              <motion.li
                whileTap={{
                  scale: 0.9,

                  backgroundColor: "ThreeDShadow",
                  transition: { duration: 0.1 },
                }}
                className="bg-inherit text-white hover:bg-[#000000b2] w-full h-full cursor-pointer  p-2 transition-colors rounded-xl duration-200"
              >
                باز کردن
              </motion.li>
              <motion.li
                whileTap={{
                  scale: 0.9,

                  backgroundColor: "ThreeDShadow",
                  transition: { duration: 0.1 },
                }}
                className="bg-inherit text-yellow-300 hover:bg-[#000000b2] w-full h-full cursor-pointer  p-2 transition-colors rounded-xl duration-200"
              >
                حذف
              </motion.li>
            </ul>
          </div>
        </Menu>
      </div>
    </>
  );
}

function Menu({ children, show, onLeave = () => {} }) {
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
            left: anchorPoint.X - ref.current?.offsetWidth / 2,
            top: anchorPoint.Y - 10,
          }}
          className={`fixed w-auto h-auto bg-transparent rounded-lg`}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}

function File({ file = {}, onChange = () => {} }) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onChange(file);
      }}
      className="flex justify-center drop-shadow-lg items-center w-40 h-40 overflow-hidden"
    >
      {file?.details?.type?.includes("image") ? (
        <BlurImage image={file} />
      ) : (
        <span>{file?.originalFilename}</span>
      )}
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BlurImage({ image, ...rest }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          alt=""
          src={image.url}
          layout="fill"
          objectFit="cover"
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75 rounded-lg",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
    </>
  );
}

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["gallery"], () => getUploads());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

GalleryPage.PageLayout = AdminLayout;

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
