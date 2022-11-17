export default function Price({ price }) {
  return <h4 className="text-sm text-atysa-800">{commify(price)} تومان</h4>;
}
function commify(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
