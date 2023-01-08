import { CustomProduct } from "@prisma/client";
import Image from "next/image";

//ui
import AddProductButton from "ui/cards/product/add-product-button";
import Price from "ui/cards/product/price";
import TrashIcon from "ui/icons/trash";
import ToolTip from "ui/tooltip";
import Button from "ui/buttons";

//with
import withConfirmation from "ui/with-confirmation";

const ButtinWithConfirm = withConfirmation(Button);

export default function SingleCustomProductView({
  product,
  isDeleting = false,
  onDelete = () => {},
}: {
  product: CustomProduct | undefined;
  isDeleting: boolean;
  onDelete: any;
}) {
  if (!product) return <></>;
  return (
    <>
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center gap-5 p-5"
      >
        <ButtinWithConfirm
          isLoading={isDeleting}
          disabled={isDeleting}
          onClick={() => {
            onDelete(product.id);
          }}
          title={"حذف بشقاب"}
          className="border-atysa-main 
           focus:border-red-700 hover:border-red-700
            border-dashed border text-white gap-2 group"
        >
          <TrashIcon
            className="w-4 h-4 stroke-atysa-main 

           group-focus:stroke-red-700 group-hover:stroke-red-700     group-hover:stroke-[2.5] 
          
           stroke-2 transition-all"
          />
          {
            <span className="text-atysa-main  group-focus:text-red-700   group-hover:text-red-700">
              حذف بشقاب
            </span>
          }
        </ButtinWithConfirm>

        <div className="flex justify-between items-center w-full">
          <p>{product.description || "بدون توضیحات"}</p>

          <AddProductButton id={product.id} product={product} />
        </div>
        <div className="flex-grow">
          <Price price={product.price} />
          <span className="text-emerald-600 text-sm font-bold">
            {product.calories} کالری
          </span>
        </div>

        <div className="flex flex-wrap gap-5 justify-end items-center rounded-xl w-full">
          {product.ingredients.map((ingredient) => {
            return (
              <ToolTip key={ingredient.id} title={ingredient.name}>
                <span className="text-atysa-main rounded-full p-1  font-bold">
                  <Image
                    placeholder="blur"
                    blurDataURL={`https://atysa.ir/icons/ingredients/مرغ.png`}
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
    </>
  );
}
