import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";

import withModal from "@/ui/modals/with-modal";

import Table, { TableSkeleton } from "@/features/admin/table";
import { getMaterials } from "api/material";
import MaterialDetails from "features/admin/material/details";
import { useState } from "react";
import { useEffect } from "react";
//ui
import Button from "ui/buttons";

const TableWithModal = withModal(Table);

export default function MaterialsTable() {
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery(["materials"], getMaterials, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: true,
  });

  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
        Cell: ({ row }) => {
          const { id, name } = row.original;
          return (
            <Link
              href={`/admin/materials/?id=${id}`}
              as={`/admin/materials/${id}`}
            >
              <div className="w-full bg-atysa-900 text-white  rounded-full py-2 px-2 shadow-md shadow-atysa-900 hover:shadow-sm transition-shadow cursor-pointer">
                {name}
              </div>
            </Link>
          );
        },
      },
      {
        Header: "حداکثر انتخاب",
        accessor: "max_choose",
      },
      {
        Header: "تعداد مواد اولیه",
        accessor: "ingredient_lenght",
        Cell: ({ row }) => {
          const { id, name, ingredients } = row.original;
          return <>{JSON.stringify(row.original.ingredients.length)}</>;
        },
      },
      {
        Header: "عکس",
        accessor: "image_url",
        Cell: ({ value }) => {
          return (
            <>
              <div className="relative flex overflow-hidden justify-center items-stretch rounded-lg w-[150px] h-[100px] leading-[0px]">
                {/* <Image src={value} width="16" height="16" layout="fill" /> */}
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  function handleCloseModal() {
    router.replace("/admin/materials", undefined, { shallow: true });
    refetch();
    setIsOpen(false);
  }

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2 w-full ">
      <Button
        className="py-2 bg-atysa-800 w-32 text-atysa-main font-bold"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        جدید
      </Button>
      {isLoading ? (
        "loading"
      ) : (
        <TableWithModal
          {...{
            columns,
            data,
            size: "md",
            center: true,
            title: `${
              !!router.query.id ? "ویرایش مواد اولیه" : "افزودن مواد اولیه"
            }`,
            isOpen: !!router.query.id || isOpen,
          }}
          onClose={handleCloseModal}
        >
          <MaterialDetails id={router.query.id} />
        </TableWithModal>
      )}
    </div>
  );
}
