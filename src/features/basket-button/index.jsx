import { useSession } from "next-auth/react";
import { useState } from "react";
import Modal from "ui/modals";
import Button from "ui/buttons";
import LoginForm from "features/login/login-form";
import AddressForm from "features/address-form";
import AddressList from "features/address-list";
export default function BasketButton({
  children,
  onClick = () => {},
  ...rest
}) {
  const { data, status } = useSession();

  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";

  const [modal, setModal] = useState({
    isOpen: false,
    type: {
      name: "",
      title: "",
    },
  });

  const hasAddress = user?.addresses.length > 0;
  const activeAddress = user?.addresses.find((a) => a.isActive === true);
  const shouldOpenAddressModal = !hasAddress || !!activeAddress;

  return (
    <>
      <Button
        {...rest}
        onClick={() => {
          if (!user)
            return setModal({
              isOpen: true,
              type: {
                name: "login",
                title: "ورود/عضویت",
              },
            });
          if (!activeAddress)
            return setModal({
              isOpen: true,
              type: {
                name: "address",
                title: hasAddress ? "انتخاب آدرس" : "افزودن آدرس",
              },
            });

          return onClick();
        }}
      >
        {children}
      </Button>

      <Modal
        size="sm"
        center
        isOpen={modal.isOpen}
        title={modal?.type?.title}
        onClose={() => setModal({ isOpen: false })}
      >
        {modal?.type?.name === "login" ? (
          <div className="w-full h-full py-5">
            <LoginForm onSuccess={() => setModal(false)} />
          </div>
        ) : modal?.type?.name === "address" ? (
          <>
            <div className="p-5 ">
              {hasAddress && !activeAddress ? (
                <AddressList />
              ) : (
                <AddressForm title="افزودن" />
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
}
