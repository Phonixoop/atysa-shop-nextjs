import Modal from "@/ui/modals";
export default function withModal(Component) {
  return function WrappedwithModal({
    children,
    isOpen,
    size,
    center = false,
    title = "",
    onClose = () => {},
    columns = [],
    data = [],
    ...rest
  }) {
    return (
      <>
        <Component {...{ columns, data, ...rest }} />

        <Modal {...{ isOpen, center, size, title, onClose }}>
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
