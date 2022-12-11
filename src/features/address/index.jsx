import { useState } from "react";
import { useSession } from "next-auth/react";

//ui
import Button from "ui/buttons";
import AddressBar from "features/address-bar";
import AddressField from "features/address-field";
import AddressList from "features/address-list";
import Modal from "ui/modals";

import AddressForm from "../address-form";

export default function Address({
  children,
  className = "",
  withArrow = true,
}) {
  const { data, status } = useSession();

  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";

  const [modal, setModal] = useState({
    isOpen: false,
    title: "آدرس",
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-5">
        <span className="w-8 h-2 bg-gray-300 rounded-xl" /> {children}
      </div>
    );
  if (!authenticated) {
    return <>{children}</>;
  }
  const hasAddress = user.addresses.length > 0;
  const activeAddress = user.addresses.find((a) => a.isActive === true);
  const title = hasAddress ? "انتخاب آدرس" : "افزودن آدرس";
  function openModal({ title }) {
    setModal(() => {
      return { isOpen: true, title };
    });
  }
  function closeModal() {
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });
  }

  return (
    <div
      dir="rtl"
      className={`flex items-center justify-start gap-10 w-fit flex-grow md:flex-grow-0 ${className}`}
    >
      {children}
      <div className="flex flex-col justify-start text-right">
        {hasAddress && activeAddress ? (
          <>
            <AddressBar withArrow={withArrow} address={activeAddress} />
          </>
        ) : (
          <>
            {authenticated && (
              <Button
                onClick={() =>
                  openModal({
                    title,
                  })
                }
                className="border-[1px] border-dashed border-atysa-main text-sm text-atysa-main"
              >
                {title}
              </Button>
            )}
            <Modal
              size="sm"
              center
              isOpen={modal.isOpen}
              title={modal?.title}
              onClose={closeModal}
            >
              <div className="p-5 ">
                {hasAddress ? <AddressList /> : <AddressForm title="افزودن" />}
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
