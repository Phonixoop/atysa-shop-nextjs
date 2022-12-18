//React
import { useState } from "react";
import { useEffect } from "react";

//react-query
import { useMutation, useQuery } from "@tanstack/react-query";

//next-auth
import { useSession } from "next-auth/react";

//features
import AddressForm from "features/address-form";
import AddressField from "features/address-field";

//ui
import Button from "ui/buttons";
import RadioBox from "ui/forms/radiobox";
import Modal from "ui/modals";

//with
import withConfirmation from "ui/with-confirmation";

//icons
import EditIcon from "ui/icons/edit";
import TrashIcon from "ui/icons/trash";
import ThreeDotsIcon from "ui/icons/three-dots";
import PlusIcon from "ui/icons/plus";

//loading
import ThreeDotsWave from "ui/loadings/three-dots-wave";

//data
import {
  updateUser,
  updateSingleAddress,
  deleteSingleAddress,
  getUser,
} from "api";

import { reloadSession } from "data";

const ButtinWithConfirm = withConfirmation(Button);

export default function AddressList({}) {
  const [addresses, setAddresses] = useState([]);
  const { data, refetch, isLoading, isInitialLoading, isFetching } = useQuery(
    ["me"],
    getUser,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: true,
      onSettled: (data) => {
        reloadSession();
        setAddresses(data ? data.data.user.addresses : []);
      },
    }
  );
  const updateUserMutate = useMutation(
    ({ id, address }) => {
      return updateSingleAddress({
        id,
        address,
      });
    },
    {
      // onMutate: async (data) => {
      //   const newAddress = data.address
      //   // Cancel any outgoing refetches
      //   // (so they don't overwrite our optimistic update)
      //   console.log(newAddress);
      //   await queryClient.cancelQueries({
      //     queryKey: ["me.addresses", newAddress.id],
      //   });

      //   // Snapshot the previous value
      //   const previousAddresses = queryClient.getQueryData([
      //     "me.addresses",
      //     newAddress.id,
      //   ]);

      //   // Optimistically update to the new value
      //   queryClient.setQueryData(["me.addresses", newAddress.id], newAddress);

      //   // Return a context with the previous and new todo
      //   return { previousAddresses, newAddress };
      // },
      // onError: (err, newAddress, context) => {
      //   queryClient.setQueryData(
      //     ["me.addresses", context.newAddress.id],
      //     context.previousAddresses
      //   );
      // },
      onSettled: (newAddress) => {
        // queryClient.invalidateQueries({
        //   queryKey: ["me", newAddress.id],
        // });
        refetch();
        reloadSession();
      },
      // onSettled: ({ data }) => {
      //   refetch();
      //   reloadSession();
      // },
    }
  );

  function handleForm({ id, address }) {
    addresses
      .filter((address) => !!address.title && !!address.description != "")
      .map((_address) => {
        return { ..._address };
      }),
      updateUserMutate.mutate({ id, address });
  }

  function setAddressActive(address) {
    const addressId = address.id;
    const addressList = [...addresses];
    const _address = addressList.find((a) => a.id === addressId);

    addressList.map((__address) => (__address.isActive = false));
    _address.isActive = true;

    handleForm({ id: addressId, address: _address });
  }
  function updateAddresses(address) {
    // const yourNextList = addresses.map((obj) => {
    //   if (obj.id === address.id) {
    //     return { ...address };
    //   }

    //   return obj;
    // });
    refetch();
  }

  useEffect(() => {
    //  setAddresses(data?.data.user.addresses);
  }, data);
  return (
    <>
      <div
        dir="rtl"
        className="w-full flex flex-col gap-3 justify-center items-center"
      >
        <AddAddressButton
          onSettled={() => {
            refetch();
          }}
        />
        {isLoading || isInitialLoading ? (
          <>
            {/* {[...new Array(6)].map((_, i) => {
              return (
                <>
                  <div
                    key={i}
                    style={{
                      opacity: 1 - i * 0.15,
                    }}
                    className={`w-full h-12  flex gap-3 justify-between items-center bg-gray-200 rounded-lg animate-pulse `}
                  />
                </>
              );
              
            })} */}
            <ThreeDotsWave />
          </>
        ) : (
          <>
            {addresses?.map((address) => {
              return (
                <div
                  key={address.id}
                  className={`w-full flex gap-3 justify-between items-center bg-gray-100 rounded-lg py-2 ${
                    address.isActive
                      ? "ring-[1.5px] shadow-md shadow-atysa-main/40 ring-atysa-main"
                      : "shadow-inner shadow-white"
                  }`}
                >
                  <div
                    onClick={() => {
                      if (addresses.length > 1) setAddressActive(address);
                    }}
                    className="w-full flex px-2 gap-3 justify-between items-center cursor-pointer"
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
                    onEditSettled={(address) => {
                      refetch();
                    }}
                    onDeleteSettled={() => {
                      refetch();
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
        {isFetching && !isLoading && <ThreeDotsWave />}
      </div>
    </>
  );
}

function AddressOptionButtons({
  address,
  onDeleteSettled = () => {},
  onEditSettled = () => {},
}) {
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
      onSettled: () => {
        onDeleteSettled();
      },
    }
  );

  return (
    <div className="flex gap-2 justify-center items-center ">
      <div className="w-fit flex md:hidden ">
        <Button onClick={() => setOptionModal({ isOpen: true })}>
          <ThreeDotsIcon />
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
              setOptionModal({ isOpen: false });
              onEditSettled(_address);
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
    ({ id, address }) => {
      return updateSingleAddress({
        id,
        address,
      });
    },
    {
      onSettled: ({ data }) => {
        onSettled();
      },
    }
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateUserAddressMutate.mutate({ id: _address.id, address: _address });
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
          <TrashIcon className="w-4 h-4 stroke-atysa-main focus:stroke-red-700 hover:stroke-red-700 hover:stroke-[2.5]  stroke-2 transition-all" />
          {isOpen && <span className="text-black">حذف</span>}
        </ButtinWithConfirm>
      </div>
    </>
  );
}

function AddAddressButton({ onSettled = () => {} }) {
  const [modal, setModal] = useState({ isOpen: false });
  return (
    <>
      <Button
        onClick={() => {
          setModal({ isOpen: true });
        }}
        className="flex w-fit justify-center items-center gap-1 ring-1 text-atysa-main ring-inset ring-atysa-main text-xs"
      >
        <span> افزودن آدرس</span>
        <PlusIcon className="w-5 h-5" />
      </Button>

      <Modal
        center
        isOpen={modal.isOpen}
        size="sm"
        zIndex="z-[10002]"
        title="افزودن آدرس"
        onClose={() => {
          setModal({
            isOpen: false,
          });
        }}
      >
        <div className="p-5">
          <AddressForm
            title={"افزودن"}
            onSettled={() => {
              setModal({
                isOpen: false,
              });
              onSettled();
            }}
          />
        </div>
      </Modal>
    </>
  );
}
