import React, { useState } from "react";
import AddressForm from "features/address-form";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import Modal from "ui/modals";
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
        className="flex justify-start items-stretch gap-2 cursor-pointer"
      >
        <div className="flex flex-col justify-end items-start text-right">
          <span className="text-atysa-800">{address?.title}</span>
          <span className="text-atysa-800 text-[10px] text-right">
            {address.description.slice(0, 40)}
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
          <AddressForm
            onSettled={() => {
              closeModal();
            }}
          />
        </div>
      </Modal>
    </>
  );
}
