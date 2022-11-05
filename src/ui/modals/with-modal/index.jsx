import Modal from "@/ui/modals";
export default function WithModal(Component) {
  return function WrappedWithModal({
    children,
    showModal,
    onClose = () => {},
    ...rest
  }) {
    return (
      <>
        <Component {...rest} />

        <Modal isOpen={showModal} onClose={() => onClose()}>
          <div className="flex flex-grow w-full justify-center overflow-y-auto">
            <div className="flex flex-1  px-10 flex-grow justify-center items-start">
              {children}
            </div>
          </div>
        </Modal>
      </>
    );
  };
}
