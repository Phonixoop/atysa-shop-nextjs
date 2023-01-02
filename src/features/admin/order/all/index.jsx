import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";

import withModal from "ui/modals/with-modal";
import ProductDetails from "features/admin/product/details";
// import ProductImage  from "ui/product-image";

import Table, { TableSkeleton } from "features/admin/table";
import { getProducts } from "api";

const TableWithModal = withModal(Table);

export default function OrdersAll() {
  const { data, refetch, isLoading, isError } = useQuery(
    ["products"],
    getProducts,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const router = useRouter();

  function handleCloseModal() {
    router.replace("/admin/orders", undefined, { shallow: true });
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
            data: ["hi"],
            size: "md",
            center: true,
            title: "ویرایش محصول",
            isOpen: !!router.query.slug,
          }}
          onClose={handleCloseModal}
        >
          <ProductDetails key={router.query.slug} slug={router.query.slug} />
        </TableWithModal>
      )}
    </>
  );
}
