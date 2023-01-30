import React, { useState } from "react";
import Button from "ui/buttons";
import TextAreaField from "ui/forms/textarea-field";
import StarIcon from "ui/icons/star";

import withLabel from "ui/forms/with-label";
import { trpc } from "utils/trpc";

const TextAreaWithLabel = withLabel(TextAreaField);

export default function UserRateCommenView({ order }) {
  const addCommentMutate = trpc.comment.addCommentAndRateScore.useMutation();

  const [selectedRate, setSelectedRate] = useState<IRate>({
    score: 0,
    title: " ",
    color: "",
  });
  const [comment, setComment] = useState<string>("");
  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <RateSelector
        selectedRate={selectedRate}
        onChange={(rate) => {
          setSelectedRate(rate);
        }}
      />
      <div className="w-full ">
        <TextAreaWithLabel
          label={`نظرتان را درباره این سفارش بنویسید`}
          value={comment}
          //@ts-ignore
          onChange={(value: string) => setComment(value)}
        />
      </div>
      <Button
        onClick={() => {
          addCommentMutate.mutate({
            message: comment,
            rate_score: selectedRate.score,
            order_id: order.id,
          });
        }}
        disabled={selectedRate.score <= 0}
        isLoading={addCommentMutate.isLoading}
        className="relative w-full bg-atysa-main text-white rounded-tr-none rounded-tl-none"
      >
        ثبت
      </Button>
    </div>
  );
}

interface IRate {
  score: number;
  title: string;
  color: string;
}
const rateArray: Array<IRate> = [
  {
    score: 1,
    title: "خیلی بد",
    color: "text-red-500",
  },
  {
    score: 2,
    title: "بد",
    color: "text-red-500",
  },
  {
    score: 3,
    title: "نسبتاً  بد",
    color: "text-red-500",
  },
  {
    score: 4,
    title: "معمولی",
    color: "text-green-500",
  },
  {
    score: 5,
    title: "خوب",
    color: "text-atysa-main",
  },
];

function RateSelector({
  selectedRate = {
    score: 0,
    title: " ",
    color: "",
  },
  onChange = (rate: IRate) => {},
}) {
  function handleClick(rate: IRate) {
    onChange(rate);
  }
  const activeStarClass = "fill-amber-300 stroke-amber-300 ";
  const idleStarClass = "stroke-gray-300 fill-gray-200";
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <span className={`font-bold h-5 ${selectedRate.color}`}>
        {selectedRate.title}
      </span>
      <div className="flex justify-center items-center gap-3">
        {rateArray.map((rate) => {
          return (
            <div
              key={rate.score}
              className="cursor-pointer"
              onClick={() => handleClick(rate)}
            >
              <StarIcon
                className={`w-7 h-7 stroke-[0.5px] ${
                  rate.score <= selectedRate.score
                    ? activeStarClass
                    : idleStarClass
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
