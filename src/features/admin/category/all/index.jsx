import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import withModal from "ui/modals/with-modal";
import CategoryDetails from "features/admin/category/details";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "api";

import Table, { TableSkeleton } from "features/admin/table";

const TableWithModal = withModal(Table);

export default function CategoryAll() {
  const { data, refetch, isLoading } = useQuery(["categories"], getCategories, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
        Cell: ({ row }) => {
          const { slug, name } = row.original;
          return (
            <div className="w-full bg-atysa-900 text-white  rounded-full py-2 px-2 shadow-md shadow-atysa-900">
              <Link
                href={`/admin/categories/?slug=${slug}`}
                as={`/admin/categories/${slug}`}
                shallow={true}
              >
                <button className="w-full">{name}</button>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "پیوند",
        accessor: "slug",
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
                  <div className="bg-green-300 w-full text-green-900 rounded-full py-1 px-2">
                    قابل نمایش
                  </div>
                ) : (
                  <div className="bg-red-300 w-full text-red-900 rounded-full py-1 px-2">
                    مخفی
                  </div>
                )}
              </div>
            </>
          );
        },
      },
      {
        Header: "تعداد محصول",
        accessor: "product_ids",
        Cell: ({ row }) => {
          const data = row.original;
          return data.product_ids.length;
        },
      },
    ],
    []
  );

  const router = useRouter();

  function handleCloseModal() {
    refetch();
    router.replace("/admin/categories", undefined, { shallow: true });
  }

  return (
    <>
      {isLoading || !!!data ? (
        "Loading"
      ) : (
        <TableWithModal
          {...{
            columns,
            data,
            title: "ویرایش",
            isOpen: !!router.query.slug,
          }}
          onClose={handleCloseModal}
        >
          <CategoryDetails slug={router.query.slug} />
        </TableWithModal>
      )}
    </>
  );
}
