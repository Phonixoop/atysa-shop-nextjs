import { useState } from "react";
import Button from "ui/buttons";
import Modal from "ui/modals";
export default function withConfirmation(Component) {
  return function WrappedComponent({
    withModal = true,
    title = "",
    onClick = () => {},
    ...rest
  }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        {isOpen && (
          <>
            {withModal ? (
              <Modal
                size="xs"
                center
                zIndex="z-[10001]"
                title={title}
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                }}
              >
                <div className="flex justify-center items-center pb-5 w-full">
                  <Content
                    onConfirm={() => {
                      setIsOpen(false);
                      onClick();
                    }}
                    onReject={() => {
                      setIsOpen(false);
                    }}
                  />
                </div>
              </Modal>
            ) : (
              <Content
                onConfirm={() => {
                  setIsOpen(false);
                  onClick();
                }}
                onReject={() => {
                  setIsOpen(false);
                }}
              />
            )}
          </>
        )}
        {!isOpen && (
          <div onClick={() => setIsOpen(true)}>
            <Component {...rest} />
          </div>
        )}
      </>
    );
  };
}

function Content({ onConfirm = () => {}, onReject = () => {} }) {
  return (
    <div className="flex gap-5">
      <div className="flex w-fit">
        <Button
          onClick={() => onReject()}
          className="px-7 rounded-lg  bg-[#D63545] text-white"
        >
          لغو
        </Button>
      </div>
      <div className="flex w-fit">
        <Button
          onClick={() => {
            onConfirm();
          }}
          className="px-6 rounded-lg  ring-1 ring-inset bg-atysa-main text-white"
        >
          تایید
        </Button>
      </div>
    </div>
  );
}

// import { Fragment } from "react";
// import { XIcon } from "@heroicons/react/solid";
// import { Dialog, Transition } from "@headlessui/react";

// export default function WithConfirmation({
//   children,
//   isOpen = false,
//   noClose = false,
//   close = () => {},
//   title = "",
//   className = "",
//   width = 300,
// }) {
//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         className={`fixed inset-0 z-40 overflow-visible overflow-y-auto bg-blue-900 bg-opacity-90 ${className}`}
//         onClose={() => !noClose && close()}
//       >
//         <div className="fixed inset-0 bg-atysa-900-800 opacity-80" />
//         <div className="flex justify-center items-center ">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0" />
//           </Transition.Child>

//           {/* This element is to trick the browser into centering the modal contents. */}
//           <span
//             className="inline-block h-screen align-middle"
//             aria-hidden="true"
//           >
//             &#8203;
//           </span>
//           <Transition.Child
//             as={Fragment}
//             show={isOpen}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <div
//               className={`border border-gray-200 mx-auto ${
//                 width ? width : "w-full md:w-1/2 2xl:w-1/4"
//               } p-8 md:inline-block text-black-700 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl md:rounded-2xl md:my-8`}
//             >
//               <div className="relative flex items-center">
//                 <div className="flex-grow">
//                   <Dialog.Title as="h3">{title}</Dialog.Title>
//                 </div>
//                 <div>{!noClose && close}</div>
//               </div>
//               <div className="mt-6">{children}</div>
//             </div>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
