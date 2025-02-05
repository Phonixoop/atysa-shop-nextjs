import { useBasket } from "context/basketContext";
import { MinusIcon } from "@heroicons/react/24/outline";
import TrashIcon from "ui/icons/trash";
import { PlusIcon } from "@heroicons/react/24/outline";

import CartButton from "ui/buttons/cartButton";

import CircleButton from "ui/buttons/circle";

export default function AddProductButton({ id = "", product = {} }) {
  const {
    increaseBasketQuantity,
    decreaseBasketQuantity,
    removeFromBasket,
    getItemQuantity,
  } = useBasket();
  const quantity = getItemQuantity(id);
  const isProductUnAvailable =
    product.available_quantity <= 0 && product.deliver_period.delay < 24;
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {quantity > 0 ? (
        <div className="flex items-center justify-between rounded-full px-[3px] py-[2px] min-w[6rem] md:w-[100px] w-[120px] h-9 bg-atysa-50 ">
          <PlusButton onClick={() => increaseBasketQuantity(id)} />
          <span className="text-atysa-800 font-bold">{quantity}</span>
          {quantity <= 1 ? (
            <TrashButton
              className="bg-transparent"
              onClick={() => removeFromBasket(id)}
            />
          ) : (
            <MinusButton onClick={() => decreaseBasketQuantity(id)} />
          )}
        </div>
      ) : (
        <CartButton
          disabled={isProductUnAvailable}
          onClick={() => increaseBasketQuantity(id, product)}
        >
          {isProductUnAvailable ? "نا موجود" : "افزودن"}
        </CartButton>
      )}
    </div>
  );
}

export function PlusButton({ children, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className="relative bg-atysa-main rounded-full  p-2 "
    >
      <PlusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
    </CircleButton>
  );
}

export function MinusButton({ children, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className="relative bg-atysa-main rounded-full  p-2 "
    >
      <MinusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
    </CircleButton>
  );
}

export function TrashButton({ children, className, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className={`relative flex justify-center items-center rounded-full hover:bg-opacity-70 p-2 group ${className}`}
    >
      <TrashIcon className="stroke-atysa-main w-3 h-3 stroke-[1.8px] group-focus:stroke-black hover:stroke-black" />
    </CircleButton>
  );
}
