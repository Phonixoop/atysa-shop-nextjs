import Button from "ui/buttons";
import EditIcon from "ui/icons/edit";
import TrashIcon from "ui/icons/trash";

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

//with
import withConfirmation from "ui/with-confirmation";

const ButtinWithConfirm = withConfirmation(Button);

export default function OptionContent({
  isOpen = false,
  deleteTitle = "",
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
          title={deleteTitle}
          extraClass="gap-5"
        >
          <TrashIcon className="w-4 h-4 stroke-atysa-main focus:stroke-red-700 hover:stroke-red-700 hover:stroke-[2.5]  stroke-2 transition-all" />
          {isOpen && <span className="text-black">حذف</span>}
        </ButtinWithConfirm>
      </div>
    </>
  );
}
