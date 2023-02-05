import AdminLayout from "layouts/admin";
import React, { useMemo, useState } from "react";
import Button from "ui/buttons";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { trpc } from "utils/trpc";
import withModalState from "ui/modals/with-modal-state";
import Modal from "ui/modals";
import Form from "ui/form";
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import DateField from "ui/forms/date-field";
import moment from "jalali-moment";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerFieldWithLabel);

export default function CouponsPage() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    coupon?: any;
    title: string;
  }>({
    isOpen: false,
    coupon: undefined,
    title: "ثبت کوپن",
  });

  const createCouponMutate = trpc.coupon.addCoupon.useMutation();
  const editCouponMutate = trpc.coupon.editCoupon.useMutation();
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <div className="w-fit">
          <Button
            className="bg-atysa-main text-white"
            onClick={() => setModal({ isOpen: true, title: "ثبت کوپن" })}
          >
            کوپن جدید
          </Button>
        </div>
        <CouponsList
          onClick={(coupon) => {
            setModal({
              isOpen: true,
              coupon: {
                ...coupon,
                expire_date: {
                  formatted: moment(coupon.expire_date)
                    .locale("fa")
                    .format("yyyy/mm/D"),
                  ISOString: coupon.expire_date,
                },
              },
              title: "ویرایش کوپن",
            });
          }}
        />
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => {
          setModal({ isOpen: false, title: "" });
        }}
        title={modal.title}
        center
        size="sm"
      >
        <CouponForm
          coupon={modal.coupon}
          onSubmit={(coupon) => {
            if (!coupon.id)
              return createCouponMutate.mutate({
                name: coupon.name,
                discount_percentage: parseInt(coupon.discount_percentage),
                expire_date: coupon.expire_date.ISOString,
                remainder_count: parseInt(coupon.remainder_count),
              });

            return editCouponMutate.mutate({
              id: coupon.id,
              name: coupon.name,
              discount_percentage: parseInt(coupon.discount_percentage),
              expire_date: coupon.expire_date.ISOString,
              remainder_count: parseInt(coupon.remainder_count),
            });
          }}
          buttonTitle={modal.title}
          isLoading={createCouponMutate.isLoading || editCouponMutate.isLoading}
        />
      </Modal>
    </>
  );
}

export function CouponsList({ onClick = (coupon) => {} }) {
  const coupons = trpc.coupon.getInfiniteCoupons.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: true,
    }
  );
  const isCouponsLoading = coupons.isFetchingNextPage || coupons.isLoading;

  const flatCoupons = useMemo(
    () => coupons.data?.pages.map((page) => page.items).flat(1) || [],
    [coupons]
  );

  const utils = trpc.useContext();

  return (
    <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-10">
      <div className="flex w-full flex-col items-center justify-center  gap-10">
        {flatCoupons.length > 0 &&
          flatCoupons.map((coupon) => {
            return (
              <div
                key={coupon.id}
                onClick={() => {
                  onClick(coupon);
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-10 rounded-lg bg-atysa-900 p-2 text-white"
              >
                <div className="flex w-full flex-grow items-center justify-between gap-10">
                  <span>{coupon.name}</span>
                  <span>
                    {moment(coupon.expire_date)
                      .locale("fa")
                      .format("D MMMM yyyy")}
                  </span>
                  <span>{coupon.discount_percentage}%</span>
                  <span>{coupon.remainder_count}</span>
                </div>
              </div>
            );
          })}
      </div>

      <Button
        disabled={isCouponsLoading || !coupons.hasNextPage}
        isLoading={isCouponsLoading}
        onClick={() => {
          coupons.fetchNextPage();
        }}
        className="bg-atysa-800 text-white"
      >
        {coupons.hasNextPage ? "بیشتر" : "تمام"}
      </Button>
    </div>
  );
  // [...]
}

function CouponForm({
  coupon,
  buttonTitle = "ثبت",
  isLoading = false,
  onSubmit = (coupon) => {},
}) {
  const [_coupon, setCoupon] = useState(coupon || {});
  return (
    <>
      <Form
        dir="rtl"
        className="flex w-full flex-col gap-5 p-5"
        onSubmit={() => {
          onSubmit(_coupon);
        }}
      >
        <div className="flex w-full items-center justify-start gap-5">
          <div className="">
            <TextFieldWithLabel
              label={"نام"}
              value={_coupon.name}
              //@ts-ignore
              onChange={(name) => {
                setCoupon((prev) => {
                  return { ...prev, name };
                });
              }}
            />
          </div>
          <div className="">
            <IntegerFieldWithLabel
              label={"درصد تخفیف"}
              value={_coupon.discount_percentage}
              //@ts-ignore
              onChange={(discount_percentage) => {
                setCoupon((prev) => {
                  return { ...prev, discount_percentage };
                });
              }}
            />
          </div>
          <div className="">
            <IntegerFieldWithLabel
              label={"تعداد باقی مانده مصرف"}
              value={_coupon.remainder_count}
              //@ts-ignore
              onChange={(remainder_count) => {
                setCoupon((prev) => {
                  return { ...prev, remainder_count };
                });
              }}
            />
          </div>
        </div>
        <div className="flex items-center  justify-center pr-16 md:w-fit">
          <DateField
            className="relative bg-atysa-primary font-bold text-atysa-main"
            title={_coupon.expire_date?.formatted || "انتخاب تاریخ انقضا"}
            value={_coupon.expire_date?.formatted}
            //@ts-ignore
            onChange={(expire_date) => {
              setCoupon((prev) => {
                return {
                  ...prev,
                  expire_date: {
                    formatted: expire_date.formatted,
                    ISOString: new Date(expire_date.original).toISOString(),
                  },
                };
              });
            }}
          />
        </div>

        <Button
          className="bg-atysa-main text-white"
          disabled={isLoading || !!!_coupon.expire_date}
          isLoading={isLoading}
          onClick={() => {
            onSubmit(_coupon);
          }}
        >
          {buttonTitle}
        </Button>
      </Form>
    </>
  );
}
CouponsPage.PageLayout = AdminLayout;
