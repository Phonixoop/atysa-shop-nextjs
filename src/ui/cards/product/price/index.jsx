export default function Price({
  price,
  max = undefined,
  className = "text-sm text-atysa-800",
}) {
  return <h4 className={className}>{commify(price, max)} تومان</h4>;
}
export function commify(x, max) {
  if (!x) return x;
  const priceString = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return priceString.slice(0, max || priceString.length);
}
