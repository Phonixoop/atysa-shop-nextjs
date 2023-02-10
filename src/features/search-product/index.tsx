import TextField from "ui/forms/text-field";
import withLabel from "ui/forms/with-label";
import withConfirmation from "ui/with-confirmation";
import { trpc } from "utils/trpc";
import React, { useDeferredValue, useMemo, useState } from "react";
import useDebounce from "hooks/useDebounce";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { Product, User } from "@prisma/client";
import UserDetails from "features/admin/user/details";
import Modal from "ui/modals";
import { signIn } from "next-auth/react";
import Button from "ui/buttons";
import SearchIcon from "ui/icons/searchs";
import { SmallProductCard } from "ui/cards/product/mobile";
import SingleProduct from "features/single-product";
import Image from "next/image";

const TextFieldWithLabel = withLabel(TextField);

export default function SearchProduct({
  className = "flex h-full w-full  flex-col-reverse items-center justify-start gap-5 pb-32 overflow-y-auto  scrollbar-none",
  query = "ss",
}: {
  className: string;
  query?: string;
}) {
  const [modal, setModal] = useState<{ isOpen: boolean; product?: Product }>({
    isOpen: false,
    product: undefined,
  });

  const defferedQuery = useDeferredValue(query);
  const debouncedSearchTerm = useDebounce(defferedQuery, 1000);
  const searchProductQuery = trpc.product.searchProduct.useQuery(
    {
      name: debouncedSearchTerm.trim(),
    },
    {
      enabled: debouncedSearchTerm.length > 0,
    }
  );

  return (
    <div className={className}>
      {searchProductQuery.isFetching && (
        <>
          <ThreeDotsWave />
        </>
      )}
      <div className="flex min-h-[15rem] w-full flex-col items-center justify-center gap-3 rounded-xl md:flex-col-reverse  ">
        {(searchProductQuery.isFetching ||
          query.trim().length <= 0 ||
          !searchProductQuery.data) && (
          <>
            <Image
              src={"/images/illustrations/search-product.png"}
              width={300}
              height={300}
              objectFit="contain"
            />
          </>
        )}

        {searchProductQuery.data && searchProductQuery.data.length > 0
          ? searchProductQuery.data?.map((product) => {
              return (
                <div
                  className="last:mb-[100px] md:last:mb-[0px]"
                  key={product.id}
                  onClick={() => {
                    setModal({
                      isOpen: true,
                      product: product,
                    });
                  }}
                >
                  <SmallProductCard key={product.id} product={product} />
                </div>
              );
            })
          : searchProductQuery.data &&
            searchProductQuery.data.length <= 0 &&
            "محصولی یافت نشد"}
      </div>
      <Modal
        center
        title="کاربر"
        isOpen={modal.isOpen}
        onClose={() => {
          setModal({
            isOpen: false,
          });
        }}
      >
        <div className="p-5">
          <SingleProduct product={modal.product} />
        </div>
      </Modal>
    </div>
  );
}

export function SearchBox({ value, onChange = (value: string) => {} }) {
  return (
    <div className="flex w-full rounded-xl bg-gray-50 shadow-sm shadow-white md:min-w-[20rem]">
      <div className="flex w-full items-center justify-end gap-3  rounded-2xl px-4 py-3  caret-atysa-secondry md:flex-grow ">
        <input
          dir="rtl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 text-right placeholder-gray-400 outline-none"
          placeholder="جستجو محصول"
        />
        <span className="h-4 w-[1px] bg-gray-400"></span>
        <SearchIcon className="h-4 w-4 fill-gray-400" />
      </div>
    </div>
  );
}
