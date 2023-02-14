import ThreeDotsWave from "ui/loadings/three-dots-wave";

import { commify } from "ui/cards/product/price";
export function DeliverPirce({ settings }) {
  if (settings.isLoading)
    return (
      <>
        <ThreeDotsWave />
      </>
    );

  if (
    !settings.data ||
    !settings.data.delivery_price ||
    settings.data.delivery_price <= 0
  )
    return (
      <>
        <span className="text-right text-sm">هزینه ارسال رایگان</span>
      </>
    );

  return (
    <>
      <span className="text-right text-sm">
        هزینه ارسال {commify(settings.data.delivery_price.toFixed())} تومان
      </span>
    </>
  );
}
