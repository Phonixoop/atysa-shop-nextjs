import CusotmDishView from "features/custom-dish";
import ThreeDotsIcon from "ui/icons/three-dots";
import { trpc } from "utils/trpc";

export default function EditCustomDishView({ id }) {
  const customProduct = trpc.user.getSingleProduct.useQuery({ id });
  if (customProduct.isLoading) return <ThreeDotsIcon />;
  if (!customProduct.data) return "بشقابی وجود ندارد";

  return (
    <>
      {/* <CusotmDishView
        value={{
          name: customProduct.data.name,
          description: customProduct.data?.description || "",
          materials: customProduct.data.materials as [],
        }}
      /> */}
    </>
  );
}
