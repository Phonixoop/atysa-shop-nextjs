import React from "react";
import StarScore from "features/star-score";

export default function Comment({ comment }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full bg-atysa-primary  p-5 rounded-md">
      <div className="w-full flex justify-start items-center gap-10 text-atysa-main text-sm">
        <span> {comment.user_name}</span>
        <div className="flex justify-start items-center flex-wrap gap-2">
          {comment.products.map((product_name) => {
            return (
              <span
                key={product_name}
                className="bg-atysa-main text-white px-2 py-1 rounded-full text-xs"
              >
                {product_name}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <p>{comment.message}</p>
        <StarScore score={comment.rate_score} />
      </div>
    </div>
  );
}
