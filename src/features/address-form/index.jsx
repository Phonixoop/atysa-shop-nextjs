import AddressField from "features/address-field";
import { useMe } from "context/meContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Button from "ui/buttons";
import { updateUser, updateSingleAddress, deleteSingleAddress } from "api";
import { useSession } from "next-auth/react";
import RadioBox from "ui/forms/radiobox";

import Modal from "ui/modals";
//icons

import EditIcon from "ui/icons/edit";
import TrashIcon from "ui/icons/trash";
import ThreeDots from "ui/icons/three-dots";

import withConfirmation from "ui/with-confirmation";
import { useEffect } from "react";

const ButtinWithConfirm = withConfirmation(Button);
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
      onSettled: ({ data }) => {
        reloadSession();
        console.log(data);
        setAddresses([...data.user.addresses]);
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
    const yourNextList = addresses.map((obj) => {
      if (obj.id === address.id) {
        return { ...address };
      }

      return obj;
    });
    console.log({ yourNextList });

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
                  console.log({ address });
                  updateAddresses(address);
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
  const [optionModal, setOptionModal] = useState({
    isOpen: false,
  });

  const deleteUserSingleAddressMutate = useMutation(
    ({ id }) => {
      return deleteSingleAddress({
        id,
      });
    },
    {
      onSettled: ({ data }) => {
        reloadSession();
        console.log(data);
        setAddresses([...data.user.addresses]);
      },
    }
  );

  return (
    <div className="flex gap-2 justify-center items-center ">
      <div className="w-fit flex md:hidden ">
        <Button onClick={() => setOptionModal({ isOpen: true })}>
          <ThreeDots />
        </Button>
      </div>
      <OptionContent
        onEdit={() => {
          setModal((prev) => {
            return { ...prev, isOpen: true };
          });
        }}
        onDelete={() => {
          deleteUserSingleAddressMutate.mutate({ id: address.id });
        }}
      />
      <Modal
        size="xs"
        isOpen={optionModal.isOpen}
        zIndex="z-[10001]"
        onClose={() => setOptionModal({ isOpen: false })}
      >
        <div className="flex flex-row w-full gap-2 justify-around px-5 py-5">
          <OptionContent
            isOpen={optionModal.isOpen}
            onEdit={() => {
              setModal((prev) => {
                return { ...prev, isOpen: true };
              });
            }}
          />
        </div>
      </Modal>

      <Modal
        center
        isOpen={modal.isOpen}
        size="sm"
        zIndex="z-[10002]"
        title="ویرایش آدرس"
        onClose={() => {
          setOptionModal({ isOpen: false });
          setModal((prev) => {
            return { ...prev, isOpen: false };
          });
        }}
      >
        <div className="p-5">
          <SingleAddressForm
            address={address}
            onSettled={(_address) => {
              setModal((prev) => {
                return { ...prev, isOpen: false };
              });
              onSubmit(_address);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

function SingleAddressForm({ address, onSettled = () => {} }) {
  const [_address, setAddress] = useState();
  const updateUserAddressMutate = useMutation(
    (data) => {
      return updateSingleAddress({
        address: data,
      });
    },
    {
      onSettled: ({ data }) => {
        onSettled(data.user.addresses.find((a) => a.id === address.id));
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
          disabled={updateUserAddressMutate.isLoading}
          isLoading={updateUserAddressMutate.isLoading}
          className="bg-atysa-main md:w-1/3 w-full"
          type="submit"
        >
          ویرایش
        </Button>
      </div>
    </form>
  );
}

function OptionContent({
  isOpen = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  return (
    <>
      <div className={`w-full ${!isOpen ? "hidden md:flex " : ""} `}>
        <Button extraClass="gap-5" onClick={() => onEdit()}>
          <EditIcon />
          {isOpen && <span className="text-black">ویرایش</span>}
        </Button>
      </div>
      <div className={`w-full ${!isOpen ? "hidden md:flex" : ""} `}>
        <ButtinWithConfirm
          onClick={() => onDelete()}
          title="حذف آدرس"
          extraClass="gap-5"
        >
          <TrashIcon />
          {isOpen && <span className="text-black">حذف</span>}
        </ButtinWithConfirm>
      </div>
    </>
  );
}
