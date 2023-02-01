import TextField from "ui/forms/text-field";
import withLabel from "ui/forms/with-label";
import withConfirmation from "ui/with-confirmation";
import { trpc } from "utils/trpc";
import React, { useDeferredValue, useMemo, useState } from "react";
import useDebounce from "hooks/useDebounce";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { User } from "@prisma/client";
import UserDetails from "features/admin/user/details";
import Modal from "ui/modals";
import { signIn } from "next-auth/react";
import Button from "ui/buttons";

const TextFieldWithLabel = withLabel(TextField);

export default function SearchUser() {
  const [modal, setModal] = useState<{ isOpen: boolean; user?: User }>({
    isOpen: false,
    user: undefined,
  });
  const [query, setQuery] = useState("");
  const defferedQuery = useDeferredValue(query);
  const debouncedSearchTerm = useDebounce(defferedQuery, 1000);
  const searchUserQuery = trpc.user.searchUser.useQuery(
    {
      phonenumber: debouncedSearchTerm.trim(),
    },
    {
      enabled: debouncedSearchTerm.length > 0,
    }
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <div className="w-fit">
        <TextFieldWithLabel
          label={"جستجو شماره موبایل"}
          value={query}
          //@ts-ignore
          onChange={(value) => setQuery(value)}
        />
      </div>
      {searchUserQuery.isLoading && <ThreeDotsWave />}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        {searchUserQuery.data?.map((user) => {
          return (
            <div
              className="flex w-fit cursor-pointer items-center justify-start gap-10 rounded-xl bg-atysa-900 p-5 text-white"
              onClick={() => {
                setModal({
                  isOpen: true,
                  user,
                });
              }}
            >
              <span>{user.phonenumber}</span>
              <span>
                {user.first_name} {"  "} {user.last_name}
              </span>
              <span>{user.role}</span>
              <span>{user.gender}</span>
              <Button
                //@ts-ignore
                onClick={async (e) => {
                  e.stopPropagation();

                  await signIn("credentials", {
                    phonenumber: user.phonenumber,
                    verificationCode: user.code,
                    callbackUrl: `${window.location.origin}/`,
                    redirect: true,
                  });
                }}
                className="w-fit min-w-[10rem] cursor-pointer  rounded-full bg-atysa-main py-2 px-2 text-white shadow-md transition-shadow hover:shadow-sm"
              >
                ورود
              </Button>
            </div>
          );
        })}
      </div>
      <Modal
        title="کاربر"
        isOpen={modal.isOpen}
        onClose={() => {
          setModal({
            isOpen: false,
          });
        }}
      >
        <div className="p-5">
          <UserDetails user={modal.user} />
        </div>
      </Modal>
    </div>
  );
}
