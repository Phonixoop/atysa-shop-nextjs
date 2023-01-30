import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { zarinpal } from "server/common/zarinpal";
import { prisma } from "server/db/client";
import Button from "ui/buttons";
export default function ZarinpalValidatePage({ isSuccessful }) {
  if (!isSuccessful)
    return (
      <div className="md:w-1/2 h-screen w-full flex flex-col gap-10 justify-center items-center">
        <Image
          src={"/images/payment/failed-payment.png"}
          width={300}
          height={300}
        />
        <div className="w-fit">
          <span className="text-red-500  p-2 rounded">پرداخت ناموفق</span>
        </div>
        <Link href={"/"} passHref>
          <a className="w-fit">
            <Button className="text-white bg-red-500">بازگشت به خانه</Button>
          </a>
        </Link>
      </div>
    );

  return (
    <div className="md:w-1/2 h-screen w-full flex flex-col gap-10 justify-center items-center">
      <Image
        src={"/images/payment/successful-payment.png"}
        width={300}
        height={300}
      />
      <div className="w-fit">
        <span className="text-emerald-500  p-2 rounded">
          پرداخت با موفقیت انجام شد
        </span>
      </div>
      <Link href={"/"} passHref>
        <a className="w-fit">
          <Button className="text-white bg-atysa-main">بازگشت به خانه</Button>
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
  console.log({ query: ctx.query });
  if (!ctx.query.Authority) return;
  const order = await prisma.order.findUnique({
    where: { authority: ctx.query.Authority },
  });

  try {
    const response = await zarinpal.PaymentVerification({
      Amount: order?.total_price,
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
