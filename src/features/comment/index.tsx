import React, { useState } from "react";
import StarScore from "features/star-score";
import moment from "jalali-moment";
import Button from "ui/buttons";
import Modal from "ui/modals";
import TextAreaField from "ui/forms/textarea-field";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import withLabel from "ui/forms/with-label";
import { trpc } from "utils/trpc";

const TextAreaWithLabel = withLabel(TextAreaField);
export default function Comment({ comment }) {
  const session = useSession();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg bg-atysa-900">
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-md  bg-atysa-primary p-5">
        <div className="flex w-full items-center justify-between gap-10 text-sm text-atysa-main">
          <div className="flex  items-center justify-between gap-10 text-sm ">
            <span className="font-bold text-atysa-main">
              {comment.user_name}
            </span>

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

        {(session.status === "authenticated" &&
          (session.data?.user as User).role) === "ADMIN" && (
          <ReplyMessageModal comment={comment} />
        )}
      </div>
      {comment.admin_reply && (
        <div className="flex w-full flex-col justify-start gap-2 p-5">
          <span className="w-fit rounded-3xl bg-atysa-main py-1 px-2 text-white">
            ادمین
          </span>
          <p className="text-white">{comment.admin_reply}</p>
        </div>
      )}
    </div>
  );
}

function ReplyMessageModal({ comment }) {
  const adminReplyMutate = trpc.comment.adminReply.useMutation({
    onSuccess: (message) => {
      setModal({
        isOpen: false,
        value: "",
      });
    },
  });

  const [modal, setModal] = useState({
    isOpen: false,
    value: comment.admin_reply,
  });

  if (!comment) return <></>;

  function validateTextArea(value?: string) {
    if (!value) return true;
    return value.length <= 0 ? true : false;
  }
  return (
    <>
      <Button
        onClick={() => setModal({ isOpen: true, value: comment.admin_reply })}
        className="max-w-[10rem] bg-gray-300 text-black"
      >
        {comment.admin_reply ? "ویرایش کامنت ادمین" : "جواب ادمین"}
      </Button>

      <Modal
        size="sm"
        center
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, value: "" })}
      >
        <div className="flex flex-col gap-5 p-5">
          <TextAreaWithLabel
            label={`نظرتان را درباره این کامنت بنویسید`}
            value={modal.value}
            //@ts-ignore
            onChange={(value: string) =>
              setModal((prev) => {
                return {
                  ...prev,
                  value,
                };
              })
            }
          />
          <Button
            onClick={() => {
              if (!modal.value || modal.value?.length <= 0) return;
              adminReplyMutate.mutate({
                commentId: comment.id,
                reply: modal.value,
              });
            }}
            disabled={
              validateTextArea(modal.value) || adminReplyMutate.isLoading
            }
            isLoading={adminReplyMutate.isLoading}
            className="bg-atysa-main text-white"
          >
            ثبت
          </Button>
        </div>
      </Modal>
    </>
  );
}
