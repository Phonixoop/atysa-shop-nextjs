import Modal from "@/ui/modals";
export default function withModal(Component) {
  return function WrappedwithModal({
    children,
    showModal,
    center = false,
    title = "",
    onClose = () => {},
    ...rest
  }) {
    return (
      <>
        <Component {...rest} />

        <Modal isOpen={showModal} {...{ center, title, onClose }}>
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
