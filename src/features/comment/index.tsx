import React from "react";
import StarScore from "features/star-score";
import moment from "jalali-moment";

export default function Comment({ comment }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-md  bg-atysa-primary p-5">
      <div className="flex w-full items-center justify-between gap-10 text-sm text-atysa-main">
        <div className="flex  items-center justify-between gap-10 text-sm ">
          <span className="font-bold text-atysa-main">{comment.user_name}</span>

          <div className="flex flex-wrap items-center justify-start gap-2">
            {comment.products.map((product_name) => {
              return (
                <span
                  key={product_name}
                  className="rounded-full bg-atysa-900 px-2 py-1 text-xs text-white"
                >
                  {product_name}
                </span>
              );
            })}
          </div>
        </div>
        <span dir="rtl" className="text-xs font-bold text-atysa-900">
          {moment(comment.created_at).locale("fa").format("D MMMM yyyy")}
        </span>
      </div>
      <div className="flex w-full justify-between">
        <p>{comment.message}</p>
        <StarScore score={comment.rate_score} />
      </div>
    </div>
  );
}
