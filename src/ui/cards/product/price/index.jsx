export default function Price({ price, max }) {
  return (
    <h4 className="text-sm text-atysa-800">{commify(price, max)} تومان</h4>
  );
}
function commify(x, max) {
  if (!x) return x;
  const priceString = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return priceString.slice(0, max || priceString.length);
}
