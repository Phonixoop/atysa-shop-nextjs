import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { zarinpal } from "server/common/zarinpal";
import { prisma } from "server/db/client";
import Button from "ui/buttons";
export default function ZarinpalValidatePage({ isSuccessful }) {
  if (!isSuccessful)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-10 md:w-1/2">
        <Image
          src={"/images/payment/failed-payment.png"}
          width={300}
          height={300}
        />
        <div className="w-fit">
          <span className="rounded  p-2 text-red-500">پرداخت ناموفق</span>
        </div>
        <Link href={"/"} passHref>
          <a className="w-fit">
            <Button className="bg-red-500 text-white">بازگشت به خانه</Button>
          </a>
        </Link>
      </div>
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10 md:w-1/2">
      <Image
        src={"/images/payment/successful-payment.png"}
        width={300}
        height={300}
      />
      <div className="w-fit">
        <span className="rounded  p-2 text-emerald-500">
          پرداخت با موفقیت انجام شد
        </span>
      </div>
      <Link href={"/"} passHref>
        <a className="w-fit">
          <Button className="bg-atysa-main text-white">بازگشت به خانه</Button>
        </a>
      </Link>
    </div>
  );
}
//http://localhost:3000/pay/zarinpal/validate?Authority=A00000000000000000000000000406044147&Status=OK
export async function getServerSideProps(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  query: any;
}) {
  const redirect = {
    href: "/",
    asPath: `/`,
    permanent: false,
  };

  if (!ctx.query.Authority) return;
  const order = await prisma.order.findUnique({
    where: { authority: ctx.query.Authority },
  });
  if (!order)
    return {
      props: {
        isSuccessful: false,
      },
    };

  try {
    const total_price_with_discount =
      order.has_coupon && order.coupon_discount_percentage
        ? order.total_price * (order.coupon_discount_percentage / 100)
        : order.total_price;
    const response = await zarinpal.PaymentVerification({
      Amount: total_price_with_discount * 1.09,
      Authority: ctx.query.Authority,
    });
    if (!response.RefID) {
      return {
        props: {
          isSuccessful: false,
        },
      };
    }

    await prisma?.order.update({
      where: {
        authority: ctx.query.Authority,
      },
      data: {
        has_payed: true,
      },
    });
    if (order.coupon_id) {
      const coupon = await prisma?.coupon.findUnique({
        where: {
          id: order.coupon_id,
        },
      });
      if (coupon)
        await prisma?.coupon.update({
          where: {
            id: order.coupon_id,
          },
          data: {
            remainder_count: coupon.remainder_count - 1,
          },
        });
    }
    return {
      props: {
        isSuccessful: true,
      },
    };
  } catch {
    return {
      props: {
        isSuccessful: false,
      },
    };
  }
}
