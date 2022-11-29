import AddressFields from "features/address-fields";
import { useMe } from "context/meContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "ui/buttons";
import { updateUser } from "api";
export default function AddressForm({ onSettled = () => {} }) {
  const { data: user, loading, refetch } = useMe();
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
        refetch();
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
        disabled={updateUserMutate.isLoading}
        isLoading={updateUserMutate.isLoading}
        className="bg-atysa-secondry w-full"
        type="submit"
      >
        ثبت
      </Button>
    </form>
  );
}
