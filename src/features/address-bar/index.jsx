import React, { useState } from "react";
import AddressList from "features/address-list";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import Modal from "ui/modals";
import LocationIcon from "ui/icons/location";
export default function AddressBar({ address, withArrow = true }) {
  const [modal, setModal] = useState({
    isOpen: false,
  });

  function openModal() {
    setModal((prev) => {
      return { ...prev, isOpen: true };
    });
  }
  function closeModal() {
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });
  }
  if (!address) return "";
  return (
    <>
      <div
        onClick={openModal}
        className="flex justify-start items-stretch gap-2 cursor-pointer "
      >
        <div className="flex justify-center items-center">
          <LocationIcon className="w4 h-4 fill-atysa-800" />
        </div>
        <div className="flex flex-col justify-end items-start text-right ">
          <span className="text-atysa-800 font-bold">{address?.title}</span>

          <span className="flex gap-2 text-atysa-800 text-[10px]  md:max-w-[15vw]  text-ellipsis overflow-hidden whitespace-nowrap  text-right">
            {address.description.slice(0, 38)}
          </span>
        </div>
        {withArrow && (
          <div className="flex justify-center items-end pb-[2px]">
            <ChevronDownIcon className="w-3 h-3  stroke-atysa-900" />
          </div>
        )}
      </div>
      <Modal
        isOpen={modal.isOpen}
        size="sm"
        center
        onClose={closeModal}
        title="انتخاب آدرس"
      >
        <div className="p-5 pb-36 w-full overflow-y-scroll">
          <AddressList />
        </div>
      </Modal>
    </>
  );
}
