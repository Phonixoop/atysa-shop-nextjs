import { useRef } from "react";

// libraries
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import Button from "ui/buttons";
import Price from "ui/cards/product/price";

export default function FactorContent({ order }) {
  const componentRef = useRef();
  const headers = [
    { label: "نام غذا", key: "details.foodName" },
    { label: "تعداد", key: "details.count" },
    { label: "قیمت", key: "details.price" },
    { label: "مجموع", key: "prices.total_count" },
  ];
  /*order.basket_items.map(({ id, quantity, product }) => {
          return {
            foodName: product.name,
            count: quantity,
            price: (quantity * product.price).toFixed(),
          };
        }),*/
  const csvReport = {
    data: [
      ["نام غذا", "تعداد", "قیمت"],
      ...order.basket_items.map(({ id, quantity, product }) => {
        return [product.name, quantity, (quantity * product.price).toFixed()];
      }),
      [],
      [],
      ["مجموع", "مالیات", "مجموع با مالیات"],
      [order.total_price, order.tax, (order.total_price * order.tax).toFixed()],
    ],

    filename: "factor.csv",
  };
  const total_price_with_discount =
    order.has_coupon && order.coupon_discount_percentage
      ? order.total_price -
        order.total_price * (order.coupon_discount_percentage / 100)
      : order.total_price;
  return (
    <div dir="rtl" className="flex flex-col gap-5 p-5 pb-10">
      <div
        dir="rtl"
        className="flex flex-col gap-5 p-2 pb-10"
        ref={componentRef}
      >
        <div className="flex flex-col items-center justify-start gap-2">
          {order.basket_items.map(({ id, quantity, product }) => {
            return (
              <>
                <Row title={product.name}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-thin text-atysa-main">
                      {quantity}x
                    </span>
                    <span>
                      <Price
                        price={product.price * quantity}
                        className="font-bold text-atysa-main "
                      />
                    </span>
                  </div>
                </Row>
              </>
            );
          })}
        </div>
        <div className="flex flex-col gap-1 ">
          <Row
            title={"جمع کل"}
            className="flex w-full items-center justify-between rounded-md  bg-white  p-2"
          >
            <Price
              price={order.total_price}
              className="font-bold text-atysa-main "
            />
          </Row>
          {order.has_coupon && (
            <Row
              title={"با تخفیف"}
              className="flex w-full items-center justify-between rounded-md  bg-white  p-2"
            >
              <Price
                price={total_price_with_discount}
                className="font-bold text-atysa-main "
              ></Price>
            </Row>
          )}
          <Row
            title={"مالیات"}
            className="flex w-full items-center justify-between rounded-md  bg-white  p-2"
          >
            <Price
              price={total_price_with_discount * 0.09}
              className="font-bold text-atysa-main "
            >
              مالیات
            </Price>
          </Row>

          <Row
            title={"مجموع با مالیات"}
            className="flex w-full items-center justify-between rounded-md  bg-white  p-2"
          >
            <Price
              price={(total_price_with_discount * 1.09).toFixed()}
              className="font-bold text-atysa-main "
            >
              تخفیف
            </Price>
          </Row>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-4">
        <ReactToPrint
          trigger={() => (
            <Button className="bg-atysa-primary text-atysa-main">
              پرینت فاکتور
            </Button>
          )}
          content={() => componentRef.current}
        />
        <Button className="bg-atysa-main text-atysa-primary">
          <CSVLink {...csvReport}>خروجی اکسل</CSVLink>
        </Button>
      </div>
    </div>
  );
}
export function Row({
  children,
  className = "flex justify-between items-center w-full bg-atysa-primary shadow-inner p-2  rounded-md",
  title,
}) {
  return (
    <div className={className}>
      <span className="w-full text-right font-bold text-atysa-main">
        {title}
      </span>
      <div className="flex min-w-fit items-center ">{children}</div>
    </div>
  );
}
