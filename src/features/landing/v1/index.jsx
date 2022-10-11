import ProductList from "@/features/productList";

export default function LandingPageV1({ products }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
      <div className="w-10/12 flex flex-col gap-5">
        <h2
          dir="rtl"
          className="w-full flex justify-start px-5 text-xl font-bold  text-right"
        >
          محصولات VIP
        </h2>
        <ProductList products={products} />
      </div>
    </div>
  );
}
