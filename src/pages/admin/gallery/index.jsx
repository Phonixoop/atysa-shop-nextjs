import AdminLayout from "layouts/admin";

//ui

import Gallery from "features/admin/gallery";

import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getUploads, deleteFileById } from "api";

export default function GalleryPage() {
  return (
    <div className="h-full w-full">
      <Gallery />
    </div>
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
