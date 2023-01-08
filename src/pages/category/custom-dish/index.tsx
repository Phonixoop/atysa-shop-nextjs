import { useState } from "react";

import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";

import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import AddProductButton from "ui/cards/product/add-product-button";

import OptionContent from "features/option-buttons";
import Price from "ui/cards/product/price";
import Image from "next/image";
import { CustomProduct } from "@prisma/client";
import ToolTip from "ui/tooltip";
import Modal from "ui/modals";
import SingleCustomProductView from "features/single-custom-product";
import Link from "next/link";
import Button from "ui/buttons";

export default function CusotmDishPage() {
  const customProducts = trpc.user.getCustomProducts.useQuery();
  const deleteProduct = trpc.user.deleteCustomProduct.useMutation();

  const [modal, setModal] = useState<{
    isOpen: boolean;
    product: CustomProduct | undefined;
  }>({
    isOpen: false,
    product: undefined,
  });
  if (customProducts.isLoading || deleteProduct.isLoading)
    return <ThreeDotsWave />;
  if (!customProducts.data) return <>ابتدا وارد شوید</>;

  if (customProducts.data.length <= 0)
    return (
      <div className="w-full flex flex-col gap-5 justify-center items-center py-5">
        <Image
          src={"/images/image-icons/custom-product-ill.png"}
          width={150}
          height={150}
        />
        <Link href={"/me/custom-dish"} passHref>
          <a>
            <Button className="py-2 px-5 bg-white text-atysa-main">
              ساخت بشقاب سفارشی
            </Button>
          </a>
        </Link>
      </div>
    );
  function openModal(product: CustomProduct) {
    setModal((prev) => {
      return {
        product,
        isOpen: true,
      };
    });
  }

  function closeModal() {
    setModal((prev) => {
      return {
        ...prev,
        isOpen: false,
      };
    });
  }
  return (
    <>
      <div
        dir="rtl"
        className="flex justify-center items-center md:flex-row md:flex-wrap flex-col w-full p-2 gap-5 "
      >
        {customProducts.data.map((product) => {
          return (
            <CustomProductCard
              key={product.id}
              product={product}
              onClick={(product: CustomProduct) => {
                openModal(product);
              }}
            />
          );
        })}
      </div>

      <Modal
        center
        size="sm"
        title={modal.product?.name}
        isOpen={modal.isOpen}
        onClose={closeModal}
      >
        <SingleCustomProductView
          product={modal.product}
          isDeleting={deleteProduct.isLoading}
          onDelete={async (id: string) => {
            await deleteProduct.mutateAsync({ id });
            closeModal();
            customProducts.refetch();
          }}
        />
      </Modal>
    </>
  );
}

function CustomProductCard({
  product,
  onClick = () => {},
}: {
  product: CustomProduct;
  onClick?: any;
}) {
  return (
    <>
      <div
        onClick={() => onClick(product)}
        className="flex bg-white w-full flex-col gap-2 justify-center items-center rounded-xl p-5 shadow-light cursor-pointer"
      >
        <span className="w-full text-right">{product.name}</span>
        <div className="flex justify-between w-full">
          <div className="flex-grow">
            <Price price={product.price} />
            <span className="text-emerald-600 text-sm font-bold">
              {product.calories} کالری
            </span>
          </div>
          <div className="flex justify-end items-center max-w-sm flex-wrap gap-2">
            {product.ingredients.map((ingredient) => {
              return (
                <ToolTip key={ingredient.id} title={ingredient.name}>
                  <span className="text-atysa-main rounded-full p-2 font-bold">
                    <Image
                      src={`https://atysa.ir/icons/ingredients/${ingredient.name}.png`}
                      width={25}
                      height={25}
                    />
                  </span>
                </ToolTip>
              );
            })}
          </div>
        </div>

        <AddProductButton id={product.id} product={product} />
      </div>
    </>
  );
}

CusotmDishPage.PageLayout = MainWithCategoryLayout;
