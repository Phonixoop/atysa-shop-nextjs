import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
//ui
import ProductImage from "@/ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";

//icons
import Location from "ui/icons/location";
import Clock from "ui/icons/clocks";
import Calendar from "ui/icons/calendar";
import Exclamation from "ui/icons/exclamation";
import Cycle from "ui/icons/cycle";

// libraries
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

//api
import { getOrdersByUserId } from "api";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const { data, status } = useSession();
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery(["orders"], () => getOrdersByUserId({ id: data.user.id }), {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <ProfileLayout>
      <h2 className="text-right p-5 text-lg font-bold w-full text-atysa-800">
        سفارش های من
      </h2>
      {isLoading || error || status === "loading" || orders.length <= 0 ? (
        <span className="py-5">...</span>
      ) : (
        <div className="flex flex-col justify-center items-center w-full pb-10  gap-2">
          {orders.length > 0 &&
            orders?.map((order, i) => {
              return (
                <div
                  key={order.id}
                  className="flex justify-between p-5 items-center flex-col gap-2 w-full border-b-2 border-gray-200"
                >
                  {/* each order */}
                  <div className="flex gap-4 w-full justify-start items-center ">
                    <div className="flex gap-1 w-fit ">
                      <Location />
                      <span className="text-sm text-atysa-900">خانه</span>
                    </div>
                    <div className="flex gap-1 w-fit">
                      <Calendar />
                      <span className="text-sm text-atysa-900">
                        دوشنبه ۲۳ آبان
                      </span>
                    </div>
                    <div className="flex gap-1 w-fit">
                      <Clock className="w-4 h-4 fill-gray-300" />
                      <span className="text-sm text-atysa-900">19:50</span>
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
                  <div className="w-full flex justify-start items-center gap-2 ">
                    <div className="flex w-fit">
                      <PriceWithLabel
                        price={order.total_price * order.tax}
                        max={order.total_price.toString().length + 1}
                      />
                    </div>
                    <div className="flex w-fit">
                      <Button extraClass="bg-atysa-500">
                        <div className="flex justify-between gap-2 items-center group">
                          <Cycle className="w-[1.15rem] h-[1.15rem] fill-white  group-hover:animate-spin " />
                          سفارش مجدد
                        </div>
                      </Button>
                    </div>
                    <div className="flex w-fit">
                      <Button extraClass=" bg-transparent ring-1 ring-inset ring-atysa-600 text-atysa-600">
                        <div className="flex justify-between gap-2 items-center">
                          <Exclamation className="w-[1.15rem] h-[1.15rem] fill-atysa-600" />
                          مشاهده فاکتور
                        </div>
                      </Button>
                    </div>
                    <div className="flex w-fit">
                      {i === 0 ? (
                        <Button extraClass="px-2 rounded-full  bg-atysa-25 text-atysa-400">
                          سفارش در حال بررسی
                        </Button>
                      ) : (
                        <Button extraClass="px-2 rounded-full  bg-green-200 text-green-600">
                          سفارش تحویل داده شده
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </ProfileLayout>
  );
}

export async function getServerSideProps({ req }) {
  const queryClient = new QueryClient();
  const token = await getToken({ req });

  await queryClient.prefetchQuery(["orders"], () =>
    getOrdersByUserId({ id: token.user.id })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

OrdersPage.PageLayout = MainLayout;
