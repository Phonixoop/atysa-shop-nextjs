import SearchProduct from "features/search-product";
import Overlay from "ui/overlay";

export default function TestPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Overlay isOpen={true}>
        <div className="flex h-full w-full items-center justify-center">
          <SearchProduct />
        </div>
      </Overlay>
    </div>
  );
}
