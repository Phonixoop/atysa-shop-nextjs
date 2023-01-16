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

  return (
    <div dir="rtl" className="flex flex-col gap-5 pb-10 p-5">
      <div
        dir="rtl"
        className="flex flex-col gap-5 pb-10 p-2"
        ref={componentRef}
      >
        <div className="flex flex-col justify-start items-center gap-2">
          {order.basket_items.map(({ id, quantity, product }) => {
            return (
              <>
                <Row title={product.name}>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-atysa-main font-thin">
                      {quantity}x
                    </span>
                    <span>
                      <Price
                        price={product.price * quantity}
                        className="text-atysa-main font-bold "
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
            className="flex justify-between items-center w-full bg-white  p-2  rounded-md"
          >
            <Price
              price={order.total_price}
              className="text-atysa-main font-bold "
            />
          </Row>
          <Row
            title={"مالیات"}
            className="flex justify-between items-center w-full bg-white  p-2  rounded-md"
          >
            <Price
              price={order.total_price * 0.09}
              className="text-atysa-main font-bold "
            >
              مالیات
            </Price>
          </Row>
          <Row
            title={"مجموع با مالیات"}
            className="flex justify-between items-center w-full bg-white  p-2  rounded-md"
          >
            <Price
              price={(order.total_price * order.tax).toFixed()}
              className="text-atysa-main font-bold "
            >
              مالیات
            </Price>
          </Row>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 px-4">
        <ReactToPrint
          trigger={() => (
            <Button className="text-atysa-main bg-atysa-primary">
              پرینت فاکتور
            </Button>
          )}
          content={() => componentRef.current}
        />
        <Button className="text-atysa-primary bg-atysa-main">
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
      <span className="w-full text-right text-atysa-main font-bold">
        {title}
      </span>
      <div className="flex items-center min-w-fit ">{children}</div>
    </div>
  );
}
