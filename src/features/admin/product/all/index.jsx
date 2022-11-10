import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";

import withModal from "@/ui/modals/with-modal";
import ProductDetails from "@/features/admin/product/details";
import ProductImage from "@/ui/product-image";

import Table, { TableSkeleton } from "@/features/admin/table";
import { getProducts } from "api";

const TableWithModal = withModal(Table);

export default function ProductAll() {
  const { data, refetch, isLoading, isError } = useQuery(
    ["products"],
    getProducts,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
        Cell: ({ row }) => {
          const { slug, name } = row.original;
          return (
            <Link
              href={`/admin/products/?slug=${slug}`}
              as={`/admin/products/${slug}`}
              shallow={true}
            >
              <div className="w-full bg-atysa-900 text-white  rounded-full py-2 px-2 shadow-md shadow-atysa-900 hover:shadow-sm transition-shadow cursor-pointer">
                {name}
              </div>
            </Link>
          );
        },
      },
      {
        Header: "پیوند",
        accessor: "slug",
      },
      {
        Header: "قیمت",
        accessor: "price",
      },
      {
        Header: "وضعیت",
        accessor: "isActive",
        Cell: ({ row }) => {
          const data = row.original.isActive;
          return (
            <>
              <div className="w-full">
                {data ? (
                  <div className="bg-green-400 w-full  shadow-inner text-green-900 rounded-full text-sm font-black py-1 px-2">
                    قابل نمایش
                  </div>
                ) : (
                  <div className="bg-red-400 w-full  shadow-inner text-red-900 rounded-full text-sm font-black py-1 px-2">
                    مخفی
                  </div>
                )}
              </div>
            </>
          );
        },
      },
      {
        Header: "دسته بندی",
        accessor: "categories",
        Cell: ({ row }) => {
          const data = row.original;
          if (data.categories.length > 0)
            return (
              <div className="flex flex-col gap-2 p-1 bg-atysa-800 bg-opacity-90 rounded-xl">
                {data.categories.map((item) => {
                  return (
                    <span className=" bg-atysa-500 text-atysa-50 text-sm  shadow-inner rounded-2xl py-1 px-2">
                      {item.name}
                    </span>
                  );
                })}
              </div>
            );
        },
      },
      {
        Header: "عکس",
        accessor: "defaultImage",
        Cell: ({ value }) => {
          return (
            <>
              <div className="relative flex overflow-hidden justify-center items-stretch rounded-lg w-[150px] h-[100px] leading-[0px]">
                <ProductImage src={value} />
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  const router = useRouter();

  function handleCloseModal() {
    router.replace("/admin/products", undefined, { shallow: true });
    refetch();
  }

  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <TableWithModal
          {...{
            columns,
            data,
            title: "ویرایش محصول",
            showModal: !!router.query.slug,
          }}
          onClose={handleCloseModal}
        >
          <ProductDetails key={router.query.slug} slug={router.query.slug} />
        </TableWithModal>
      )}
    </>
  );
}
