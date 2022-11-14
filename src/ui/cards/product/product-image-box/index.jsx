import ProductImage from "ui/product-image";
import BookmarkIcon from "ui/icons/bookmark";
export default function ProductImageBox({
  className = "relative flex overflow-hidden justify-center items-stretch rounded-bl-lg w-[150px] h-[100px] leading-[0px]",
  src = "",
  alt = "",
  onClick = () => {},
}) {
  return (
    <div className={className}>
      <ProductImage {...{ onClick, src, alt }} />
      <span className="absolute top-2 right-2">
        <BookmarkIcon className="w-6 h-6 stroke-[#000000ac] fill-[#000000ac] " />
      </span>
    </div>
  );
}
