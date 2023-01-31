import Comment from "features/comment";
import AdminLayout from "layouts/admin";
import React from "react";
import Button from "ui/buttons";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import { trpc } from "utils/trpc";

export default function CommentsPage() {
  return (
    <div className="flex justify-center items-center w-full">
      <Comments />
    </div>
  );
}

export function Comments() {
  const comments = trpc.comment.getInfiniteComments.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const isCommentsLoading = comments.isFetchingNextPage || comments.isLoading;
  const flatComments = comments.data?.pages.flatMap((a) => a.items) || [];

  const utils = trpc.useContext();
  const updateCommentAcceptionMutate =
    trpc.comment.updateCommentAcception.useMutation({
      async onMutate(updatedComment) {
        // Cancel outgoing fetches (so they don't overwrite our optimistic update)
        await utils.comment.getInfiniteComments.cancel();

        // Get the data from the queryCache
        const prevData = utils.comment.getInfiniteComments.getData();
        const newItems = flatComments?.map((item) => {
          if (item.id === updatedComment.commentId)
            item.isAccepted = updatedComment.accept;
          return item;
        });

        // Optimistically update the data with our new comment
        utils.comment.getInfiniteComments.setData(
          {},
          { items: [...newItems], nextCursor: undefined }
        );

        // Return the previous data so we can revert if something goes wrong
        return { prevData };
      },
      onError(err, newPost, ctx) {
        // If the mutation fails, use the context-value from onMutate
        utils.comment.getInfiniteComments.setData({}, ctx?.prevData);
      },
      onSettled() {
        // Sync with server once mutation has settled
        comments.refetch();
      },
    });

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full max-w-3xl">
      <div className="flex flex-col justify-center items-center gap-10  w-full">
        {flatComments.length > 0 &&
          flatComments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="flex justify-center items-center gap-10 w-full"
              >
                <div className="flex-grow min-w-fit">
                  <Button
                    onClick={() => {
                      updateCommentAcceptionMutate.mutate({
                        commentId: comment.id,
                        accept: !comment.isAccepted,
                      });
                    }}
                    disabled={
                      updateCommentAcceptionMutate.isLoading &&
                      updateCommentAcceptionMutate.variables?.commentId ===
                        comment.id
                    }
                    isLoading={
                      updateCommentAcceptionMutate.isLoading &&
                      updateCommentAcceptionMutate.variables?.commentId ===
                        comment.id
                    }
                    className={`${
                      comment.isAccepted
                        ? "bg-red-500 text-white"
                        : "bg-atysa-main text-white"
                    }`}
                  >
                    {comment.isAccepted ? "رد کردن" : "قبول کردن"}
                  </Button>
                </div>
                <div className="flex-grow w-full">
                  <Comment
                    comment={{
                      ...comment,
                      user_name:
                        comment.user.first_name + " " + comment.user.last_name,
                      products: comment.order.basket_items.flatMap(
                        //@ts-ignore
                        (a) => a.product.name
                      ),
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      <Button
        disabled={isCommentsLoading || !comments.hasNextPage}
        isLoading={isCommentsLoading}
        onClick={() => {
          comments.fetchNextPage();
        }}
        className="bg-atysa-800 text-white"
      >
        {comments.hasNextPage ? "بیشتر" : "تمام"}
      </Button>
    </div>
  );
  // [...]
}
CommentsPage.PageLayout = AdminLayout;
