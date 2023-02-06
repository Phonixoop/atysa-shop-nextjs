import Comment from "features/comment";
import AdminLayout from "layouts/admin";
import React, { useDeferredValue, useMemo, useState } from "react";
import Button from "ui/buttons";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { trpc } from "utils/trpc";
import withModal from "ui/modals/with-modal";
import Table from "features/admin/table";
import { Coupon, User } from "@prisma/client";
import { signIn } from "next-auth/react";
import UserDetails from "features/admin/user/details";
import { GENDERS, ROLES } from "data";
import SearchUser from "features/admin/user/search-user";
import moment from "jalali-moment";
import Form from "ui/form";

import withModalState from "ui/modals/with-modal-state";
import Modal from "ui/modals";

import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import DateField from "ui/forms/date-field";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerFieldWithLabel);

const TableWithModal = withModal(Table);

export default function CouponsPage2() {
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
                expire_date: moment(coupon.expire_date.ISOString).toDate(),
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
    }
  );

  const [modal, setModal] = useState<{ isOpen: boolean; coupon?: Coupon }>({
    isOpen: false,
    coupon: undefined,
  });

  function handleOpenModal(coupon: Coupon) {
    setModal({
      isOpen: false,
      coupon,
    });
  }

  function handleCloseModal() {
    setModal({
      isOpen: false,
    });
  }

  const flatCoupons = useMemo(
    () => coupons.data?.pages.map((page) => page.items).flat(1) || [],
    [coupons]
  );

  const columns =
    useMemo(
      () => [
        {
          Header: "کد",
          accessor: "name",
          Cell: ({ row }) => {
            const coupon: Coupon = row.original;
            return (
              <button onClick={() => onClick(coupon)}>{coupon.name}</button>
            );
          },
        },
        {
          Header: "تاریخ انقضا",
          accessor: "expire_date",
          Cell: ({ row }) => {
            const coupon: Coupon = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {moment(coupon.expire_date).locale("fa").format("D MMMM yyyy")}
              </div>
            );
          },
        },
        {
          Header: "درصد تخفیف",
          accessor: "discount_percentage",
          Cell: ({ row }) => {
            const coupon: Coupon = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {coupon.discount_percentage}%
              </div>
            );
          },
        },
        {
          Header: "تعداد باقی مانده",
          accessor: "remainder_count",
          Cell: ({ row }) => {
            const coupon: Coupon = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  py-2 px-2 text-atysa-900  transition-shadow hover:shadow-sm">
                {coupon.remainder_count}
              </div>
            );
          },
        },
      ],
      []
    ) || [];

  return (
    <div className=" flex w-full flex-col gap-10">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <TableWithModal
          {...{
            columns: flatCoupons.length > 0 ? columns : [],
            data: flatCoupons,

            size: "md",
            center: true,
            title: "جزئیات سفارش",
            isOpen: modal.isOpen,
          }}
          onClose={handleCloseModal}
        >
          .
        </TableWithModal>
        {coupons.isLoading && <ThreeDotsWave />}
        <div className=" w-fit min-w-[10rem]">
          <Button
            onClick={() => coupons.fetchNextPage()}
            disabled={!coupons.hasNextPage || coupons.isFetchingNextPage}
            className=" bg-atysa-900 text-white"
          >
            {coupons.isFetchingNextPage
              ? "در حال لود"
              : coupons.hasNextPage
              ? "بیشتر"
              : "تمام"}
          </Button>
        </div>
      </div>
    </div>
  );
  // [...]
}

function CouponForm({
  coupon,
  buttonTitle = "ثبت",
  isLoading = false,
  onSubmit = (coupon: any) => {},
  onDelete = () => {},
}) {
  const [_coupon, setCoupon] = useState(coupon || {});
  const deleteCouponMutate = trpc.coupon.deleteCoupon.useMutation({
    onError: () => {
      console.log("error");
    },
    onSettled: () => {
      onDelete();
    },
  });
  return (
    <>
      <Form
        dir="rtl"
        className="flex w-full flex-col gap-5 p-5"
        onSubmit={() => {
          console.log("hi");
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
                  return { ...prev, name: name.toUpperCase() };
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
          type="submit"
          className="bg-atysa-main text-white"
          disabled={isLoading || !!!_coupon.expire_date}
          isLoading={isLoading}
        >
          {buttonTitle}
        </Button>

        {coupon?.id && (
          <Button
            className="bg-amber-500 text-black"
            disabled={deleteCouponMutate.isLoading}
            isLoading={deleteCouponMutate.isLoading}
            onClick={() => {
              deleteCouponMutate.mutate({ id: coupon.id });
            }}
          >
            حذف کوپن
          </Button>
        )}
      </Form>
    </>
  );
}

CouponsPage2.PageLayout = AdminLayout;
