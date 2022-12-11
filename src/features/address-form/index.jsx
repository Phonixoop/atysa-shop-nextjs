import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

//features
import AddressField from "features/address-field";

//ui
import Button from "ui/buttons";

//data
import { createAddress } from "api";

import { reloadSession } from "data";

export default function AddressForm({ title = "", onSettled = () => {} }) {
  const [address, setAddress] = useState({});

  const createUserAddressMutate = useMutation(
    (data) => {
      return createAddress({
        address: data,
      });
    },
    {
      onSettled: ({ data }) => {
        onSettled();
        reloadSession();
        //   onSettled(data.user.addresses.find((a) => a.id === address.id));
      },
    }
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createUserAddressMutate.mutate(address);
      }}
    >
      <AddressField
        onChange={(address) => {
          setAddress(address);
        }}
      />
      <div className="flex w-full justify-center items-center">
        <Button
          disabled={createUserAddressMutate.isLoading}
          isLoading={createUserAddressMutate.isLoading}
          className="bg-atysa-main md:w-1/3 w-full"
          type="submit"
        >
          {title}
        </Button>
      </div>
    </form>
  );
}
