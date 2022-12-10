import AddressField from "features/address-field";
import { useMe } from "context/meContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "ui/buttons";
import { updateUser, updateSingleAddress } from "api";
import { useSession } from "next-auth/react";
import RadioBox from "ui/forms/radiobox";

import Modal from "ui/modals";
//icons

import EditIcon from "ui/icons/edit";
import TrashIcon from "ui/icons/trash";
import ThreeDots from "ui/icons/three-dots";

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export default function AddressForm({ onSettled = () => {} }) {
  const { data, status } = useSession();
  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";
  const [addresses, setAddresses] = useState([...user.addresses]);
  const updateUserMutate = useMutation(
    ({ data }) => {
      return updateUser({
        user: {
          addresses: data,
        },
      });
    },
    {
      onSettled: () => {
        reloadSession();
        setAddresses([...user.addresses]);
      },
    }
  );

  function handleForm() {
    addresses
      .filter((address) => !!address.title && !!address.description != "")
      .map((_address) => {
        return { ..._address };
      }),
      updateUserMutate.mutate({
        data: addresses,
      });
  }
  function handleToggleYourList(addressId, isActive) {
    const yourNextList = [...addresses];
    const address = yourNextList.find((a) => a.id === addressId);

    yourNextList.map((a) => (a.isActive = false));
    address.isActive = isActive;
    setAddresses(yourNextList);
    handleForm();
  }
  function updateAddresses(address) {
    const yourNextList = [...addresses];
    yourNextList.map((a, i) => {
      if (a.id === address.id) {
        return (yourNextList[i] = address);
      }
    });

    setAddresses(yourNextList);
  }

  return (
    <>
      <div
        dir="rtl"
        className="w-full flex flex-col gap-3 justify-center items-center"
      >
        {addresses?.map((address) => {
          return (
            <div
              className={`w-full flex gap-3 justify-between items-center bg-gray-100 rounded-lg py-2 ${
                address.isActive
                  ? "ring-[1.5px] shadow-md shadow-atysa-main/40 ring-atysa-main"
                  : "shadow-inner shadow-white"
              }`}
            >
              <div
                onClick={() => {
                  handleToggleYourList(address.id, true);
                }}
                className="w-full flex gap-3 justify-between items-center cursor-pointer"
              >
                <RadioBox groupName="address" checked={address.isActive} />
                <div className="flex md:flex-row md:gap-2 flex-col justify-right items-right w-full">
                  <span className=" font-bold text-atysa-900 ">
                    {address.title}
                  </span>
                  <p className="text-atysa-900 text-sm">
                    {address.description}
                  </p>
                </div>
              </div>

              <AddressOptionButtons
                address={address}
                onSubmit={(address) => {
                  updateAddresses(address);
                  handleForm();
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

function AddressOptionButtons({ address, onSubmit = () => {} }) {
  const [modal, setModal] = useState({
    isOpen: false,
    address,
  });
  return (
    <div className="flex gap-2 justify-center items-center ">
      <div className="w-fit flex md:hidden ">
        <Button>
          <ThreeDots />
        </Button>
      </div>
      <div className="w-fit hidden md:flex">
        <Button
          onClick={() =>
            setModal((prev) => {
              return { ...prev, isOpen: true };
            })
          }
        >
          <EditIcon />
        </Button>
      </div>
      <div className="w-fit hidden md:flex">
        <Button>
          <TrashIcon />
        </Button>
      </div>

      <Modal
        center
        isOpen={modal.isOpen}
        title="ویرایش آدرس"
        onClose={() => {
          reloadSession();
          setModal((prev) => {
            return { ...prev, isOpen: false };
          });
        }}
      >
        <div className="p-5">
          <SingleAddressForm address={address} />
        </div>
      </Modal>
    </div>
  );
}

function SingleAddressForm({ address }) {
  const [_address, setAddress] = useState();
  const updateUserAddressMutate = useMutation(
    (data) => {
      return updateSingleAddress({
        address: data,
      });
    },
    {
      onSettled: () => {
        reloadSession();
      },
    }
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        updateUserAddressMutate.mutate(_address);
      }}
      className="flex flex-col gap-2"
    >
      <AddressField
        address={address}
        onChange={(address) => {
          setAddress(address);
        }}
      />
      <div className="flex w-full justify-center items-center">
        <Button
          // disabled={updateUserMutate.isLoading || isLoading}
          // isLoading={updateUserMutate.isLoading}
          className="bg-atysa-main md:w-1/3 w-full"
          type="submit"
        >
          ثبت
        </Button>
      </div>
    </form>
  );
}
