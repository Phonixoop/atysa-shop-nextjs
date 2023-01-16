import { useState } from "react";
import Modal from "ui/modals";
export default function withModalState(Component) {
  return function WrappedwithModal({
    children,
    isOpen,
    size,
    center = false,
    title = "",
    ...rest
  }) {
    const [modal, setModal] = useState({ isOpen: false });

    const openModal = () => setModal({ isOpen: true });
    const closeModal = () => setModal({ isOpen: false });

    return (
      <>
        <Component onClick={openModal} {...rest} />
        <Modal
          {...{
            isOpen: modal.isOpen,
            center,
            size,
            title,
            onClose: closeModal,
          }}
        >
          {children}
        </Modal>
      </>
    );
  };
}
