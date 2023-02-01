import Comment from "features/comment";
import AdminLayout from "layouts/admin";
import React, { useMemo, useState } from "react";
import Button from "ui/buttons";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { trpc } from "utils/trpc";
import withModal from "ui/modals/with-modal";
import Table from "features/admin/table";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import UserDetails from "features/admin/user/details";
import { GENDERS, ROLES } from "data";
const TableWithModal = withModal(Table);

export default function UsersPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <Users />
    </div>
  );
}

export function Users() {
  const users = trpc.user.getInfiniteUsers.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const isUsersLoading = users.isFetchingNextPage || users.isLoading;
  const [modal, setModal] = useState<{ isOpen: boolean; user?: User }>({
    isOpen: false,
    user: undefined,
  });
  function handleCloseModal() {
    setModal({
      isOpen: false,
    });
  }

  const flatUsers = useMemo(
    () => users.data?.pages.map((page) => page.items).flat(1) || [],
    [users]
  );

  const columns =
    useMemo(
      () => [
        {
          Header: "شماره",
          accessor: "phonenumber",
          Cell: ({ row }) => {
            const user = row.original;
            return (
              <div
                onClick={() => {
                  setModal({
                    isOpen: true,
                    user,
                  });
                }}
                className="w-full cursor-pointer rounded-full  bg-atysa-900 py-2 px-2 text-white shadow-md shadow-atysa-900 transition-shadow hover:shadow-sm"
              >
                {user.phonenumber}
              </div>
            );
          },
        },
        {
          Header: "نام و نام خانوادگی",
          accessor: "first_nameAndlast_name",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {user.first_name} {user.last_name}
              </div>
            );
          },
        },
        {
          Header: "جنسیت",
          accessor: "gender",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {GENDERS.find((a) => a.id === user.gender)?.value}
              </div>
            );
          },
        },
        {
          Header: "نقش",
          accessor: "role",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {ROLES.find((a) => a.id === user.role)?.value}
              </div>
            );
          },
        },
        {
          Header: "عملیات",
          accessor: "",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div
                onClick={async () => {
                  await signIn("credentials", {
                    phonenumber: user.phonenumber,
                    verificationCode: user.code,
                    callbackUrl: `${window.location.origin}/`,
                    redirect: true,
                  });
                }}
                className="w-full cursor-pointer rounded-full bg-atysa-main py-2 px-2 text-white shadow-md shadow-atysa-main transition-shadow hover:shadow-sm"
              >
                ورود
              </div>
            );
          },
        },
      ],
      []
    ) || [];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <TableWithModal
        {...{
          columns: flatUsers.length > 0 ? columns : [],
          data: flatUsers,

          size: "md",
          center: true,
          title: "جزئیات سفارش",
          isOpen: modal.isOpen,
        }}
        onClose={handleCloseModal}
      >
        <UserDetails user={modal?.user} />
      </TableWithModal>
      <div className=" w-fit min-w-[10rem]">
        <Button
          onClick={() => users.fetchNextPage()}
          disabled={!users.hasNextPage || users.isFetchingNextPage}
          className=" bg-atysa-900 text-white"
        >
          {users.isFetchingNextPage
            ? "در حال لود"
            : users.hasNextPage
            ? "بیشتر"
            : "تمام"}
        </Button>
      </div>
    </div>
  );
  // [...]
}
UsersPage.PageLayout = AdminLayout;
