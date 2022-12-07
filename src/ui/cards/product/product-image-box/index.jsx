import ProductImage from "ui/product-image";
import BookmarkIcon from "ui/icons/bookmark";
export default function ProductImageBox({
  className = "relative flex overflow-hidden justify-center items-stretch rounded-bl-lg w-[150px] h-[100px] leading-[0px]",
  src = "",
  alt = "",
  objectFit = "cover",
  width = 400,
  height = 300,
  special = false,
  onClick = () => {},
  ...rest
}) {
  return (
    <div className={className}>
      <ProductImage
        {...{ onClick, src, alt, objectFit, width, height }}
        {...rest}
      />
      {special && (
        <span className="absolute top-2 right-2">
          <BookmarkIcon className="w-6 h-6 stroke-[#000000ac] fill-[#000000ac] " />
        </span>
      )}
    </div>
  );
}
