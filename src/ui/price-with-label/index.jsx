import Price from "ui/cards/product/price";
export default function PriceWithLabel({
  children,
  className = "text-atysa-900",
  price = 0,
  max,
}) {
  return (
    <div className="flex w-full justify-between px-3">
      <span className={className}>{children}</span>
      <span>
        <Price className={className} {...{ price, max }} />
      </span>
    </div>
  );
}
