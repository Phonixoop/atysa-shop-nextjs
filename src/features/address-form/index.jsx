import AddressFields from "features/address-fields";
import { useMe } from "context/meContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "ui/buttons";
import { updateUser } from "api";
import { useSession } from "next-auth/react";

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export default function AddressForm({ onSettled = () => {} }) {
  const { data, status } = useSession();
  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [userForm, setUserForm] = useState({
    addresses: user.addresses,
  });
  const updateUserMutate = useMutation(
    ({ data }) => {
      return updateUser({ user: data });
    },
    {
      onSettled: () => {
        onSettled();
        reloadSession();
      },
    }
  );

  function handleForm() {
    userForm.addresses
      .filter((address) => !!address.title && !!address.description != "")
      .map((_address) => {
        return { ..._address };
      }),
      updateUserMutate.mutate({
        data: userForm,
      });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleForm();
      }}
      className="flex flex-col gap-2"
    >
      <AddressFields
        values={user.addresses}
        onChange={(addresses) => {
          setUserForm((prev) => {
            return { ...prev, addresses };
          });
        }}
      />
      <Button
        disabled={updateUserMutate.isLoading || isLoading}
        isLoading={updateUserMutate.isLoading}
        className="bg-atysa-secondry w-full"
        type="submit"
      >
        ثبت
      </Button>
    </form>
  );
}
