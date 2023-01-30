//ui
import ProductImage from "ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";
import Price from "ui/cards/product/price";
import DateTime from "ui/date-time";
import Modal from "ui/modals";
import Map from "ui/map";
import FullName from "ui/fullname";

//featuers
import FactorContent from "features/factor";
import FactorButton from "features/factor/factor-button";
//icon
import LocationIcon from "ui/icons/location";
import ClockIcon from "ui/icons/clocks";
import CalendarIcon from "ui/icons/calendar";
import ExclamationIcon from "ui/icons/exclamation";
import CycleIcon from "ui/icons/cycle";

//with
import withModalState from "ui/modals/with-modal-state";

import { ORDER_STATUS } from "data";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { updateOrderStatus } from "api";

const ButtonWithModalState = withModalState(FactorButton);

export default function OrderDetails({ order = undefined }) {
  const [modal, setModal] = useState({ isOpen: false });
  const updateOrderStatusMutate = useMutation(
    ({ id, orderStatus }) => updateOrderStatus({ id, orderStatus }),
    {
      onSettled: (result) => {},
    }
  );

  if (!order) return "empty";
  return (
    <>
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center w-full pb-10  gap-2"
      >
        <div className="flex justify-between p-5 items-center flex-col gap-2 w-full border-b-2 border-gray-200">
          <div className=" w-full flex flex-col gap-2 justify-center items-center">
            <FullName
              className="w-fit text-right text-base font-bold"
              user={order.user}
            />
            <span className="text-atysa-main"> {order.user.phonenumber}</span>
          </div>
          {/* each order */}
          <div className="flex gap-4 w-full justify-start items-center ">
            <button
              type="button"
              className="flex gap-1 w-fit "
              onClick={() => {
                setModal({ isOpen: true, location: order.address.location });
              }}
            >
              <LocationIcon className="w-4 h-4 fill-gray-500" />
              <span> {order.address.title}</span>
            </button>
            <div className="flex gap-1 w-fit">
              <DateTime value={order.created_at} />
            </div>
            <div className="flex gap-1 w-fit">
              <span>شماره تماس</span>
              <span>{order.address?.phonenumber}</span>
            </div>
          </div>

          {order.basket_items.map(({ id, quantity, product }) => {
            return (
              <>
                <div
                  key={id}
                  className="flex justify-between products-center w-full gap-1  "
                >
                  <div className="flex gap-5 justify-center items-center products-center">
                    <div className="w-14 h-14">
                      <ProductImage src={product.defualtImage} />
                    </div>
                    <div>{product.name}</div>
                    <div>{quantity}x</div>
                  </div>
                </div>
              </>
            );
          })}
          <div className="w-full flex flex-col flex-wrap justify-right bg-atysa-25 py-5 rounded-md items-center gap-2 ">
            <div className="flex w-fit font-bold">
              <PriceWithLabel
                price={order.total_price * order.tax}
                max={order.total_price.toString().length + 1}
              />
            </div>
            <div className="flex w-fit gap-2 text-atysa-main font-bold">
              <span> تاریخ تحویل سفارش : </span>
              <span> {order.deliver_datetime_string} </span>
            </div>

            <div className="flex w-fit">
              <ButtonWithModalState center size="sm" title={`فاکتور سفارش`}>
                <FactorContent order={order} />
              </ButtonWithModalState>
            </div>
            {/* <div className="flex w-fit">
              <Button
                className="bg-transparent ring-1 ring-inset ring-atysa-600 text-atysa-600"
                onClick={() => {
                  updateOrderStatusMutate.mutate({
                    id: order.id,
                    orderStatus: "ACCEPTED",
                  });
                }}
              >
                تایید سفارش
              </Button>
            </div> */}
            <div className="flex w-fit">
              <select
                disabled={
                  ORDER_STATUS[order.status] === ORDER_STATUS.USER_REJECTED
                }
                onChange={(e) => {
                  updateOrderStatusMutate.mutate({
                    id: order.id,
                    orderStatus: e.target.value,
                  });
                  console.log(e.target.value);
                }}
              >
                {Object.entries(ORDER_STATUS).map(([key, value]) => {
                  return (
                    <option
                      disabled={value === ORDER_STATUS.USER_REJECTED}
                      key={key}
                      value={key}
                      selected={order.status === key}
                    >
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        center
        onClose={() => {
          setModal({ isOpen: false });
        }}
      >
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full ">
          <div className="w-full h-5/6">
            <Map location={modal.location} withClick={false} />
          </div>
        </div>
      </Modal>
    </>
  );
}
