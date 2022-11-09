import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AdminLayout from "layouts/adminLayout";

//ui

import ContextMenu from "ui/context-menu";
import GalleryView from "ui/gallery-view";
import { motion } from "framer-motion";
import { uploadFile } from "api";

import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { getUploads, deleteFileById } from "api";

export default function Gallery() {
  const { data: galleryData, refetch } = useQuery(
    ["gallery"],
    () => getUploads(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      onSuccess: (data) => {
        console.log(data);
        setFiles(data);
      },
    }
  );
  const [files, setFiles] = useState(galleryData || []);
  const uploadFileMutate = useMutation(
    ({ file }) => {
      return uploadFile({ file });
    },
    {
      onMutate: (file) => {
        return file;
      },
      onSuccess: ({ file }, newDroppedFile, context) => {
        setFiles((prev) => [file, ...prev]);
      },
    }
  );

  const deleteFileMutate = useMutation(({ id }) => deleteFileById({ id }), {
    onSuccess: (data) => {
      setFiles((prev) => prev.filter((a) => a.id !== data.id));
    },
  });

  const [selectedFileId, setSelectedFileId] = useState(undefined);
  const selectedFile = useMemo(
    () => files?.find((file) => file?.id == selectedFileId),
    [files, selectedFileId]
  );

  useEffect(() => {}, [files]);
  return (
    <>
      <GalleryView
        data={files}
        onDrop={(files) => {
          files.map(({ details }) => {
            uploadFileMutate.mutate({ file: details });
          });
        }}
        onSelect={(file) => {
          setSelectedFileId(file.id);
        }}
      />

      <ContextMenu
        show={!!selectedFileId}
        onLeave={() => setSelectedFileId(undefined)}
      >
        <div className="w-48 h-full p-1 bg-[#000000b3] backdrop-blur-sm rounded-xl overflow-hidden select-none ">
          <ul className="flex flex-col gap-1">
            <li className="bg-inherit text-white w-full h-full p-2 transition-colors  shadow-xl border-b-[1px] border-dashed duration-200">
              {selectedFile?.originalFilename}
            </li>
            <AnimatedButton
              onClick={() => {
                deleteFileMutate.mutate({ id: selectedFileId });
              }}
              color="text-yellow-300"
            >
              حذف
            </AnimatedButton>
          </ul>
        </div>
      </ContextMenu>
    </>
  );
}

function AnimatedButton({
  children,
  color = "text-green-600",
  onClick = () => {},
}) {
  return (
    <motion.li
      className={`bg-inherit ${color} hover:bg-[#000000b2] w-full h-full cursor-pointer  p-2 transition-colors rounded-xl duration-200`}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.1 },
      }}
      onClick={onClick}
    >
      {children}
    </motion.li>
  );
}

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
