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
        className="flex w-full flex-col items-center justify-center gap-2  pb-10"
      >
        <div className="flex w-full flex-col items-center justify-between gap-2 border-b-2 border-gray-200 p-5">
          <div className=" flex w-full flex-col items-center justify-center gap-2">
            <FullName
              className="w-fit text-right text-base font-bold"
              user={order.user}
            />
            <span className="text-atysa-main"> {order.user.phonenumber}</span>
          </div>
          {/* each order */}
          <div className="flex w-full items-center justify-start gap-4 ">
            <button
              type="button"
              className="flex w-fit gap-1 "
              onClick={() => {
                setModal({ isOpen: true, location: order.address.location });
              }}
            >
              <LocationIcon className="h-4 w-4 fill-gray-500" />
              <span> {order.address.title}</span>
            </button>
            <div className="flex w-fit gap-1">
              <DateTime value={order.created_at} />
            </div>
            <div className="flex w-fit gap-1">
              <span>شماره تماس</span>
              <span>{order.address?.phonenumber}</span>
            </div>
          </div>

          {order.basket_items.map(({ id, quantity, product }) => {
            return (
              <>
                <div
                  key={id}
                  className="products-center flex w-full justify-between gap-1  "
                >
                  <div className="products-center flex items-center justify-center gap-5">
                    <div className="h-14 w-14">
                      <ProductImage src={product.defualtImage} />
                    </div>
                    <div>{product.name}</div>
                    <div>{quantity}x</div>
                  </div>
                </div>
              </>
            );
          })}
          <div className="justify-right flex w-full flex-col flex-wrap items-center gap-2 rounded-md bg-atysa-25 py-5 ">
            <div className="flex w-fit font-bold">
              <PriceWithLabel
                price={order.total_price * order.tax}
                max={order.total_price.toString().length + 1}
              />
            </div>
            <div className="flex w-fit gap-2 font-bold text-atysa-main">
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
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 ">
          <div className="h-5/6 w-full">
            <Map location={modal.location} withClick={false} />
          </div>
        </div>
      </Modal>
    </>
  );
}
