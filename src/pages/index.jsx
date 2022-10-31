import MainWithCategoryLayout from "@/layouts/mainWithCategoryLayout";
import { getProducts, getCategories } from "@/api";
import LandingPageV1 from "features/landing/v1";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // return <>{initialProducts.length}</>;

  return <LandingPageV1 />;
}
HomePage.PageLayout = MainWithCategoryLayout;
export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], getProducts);
  await queryClient.prefetchQuery(["categories"], getCategories);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
// export async function getServerSideProps(context) {
//   // const session = await unstable_getServerSession(req, res, authOptions);
//   // console.log(session);

//   const categories = await getCategory();
//   if (categories === undefined || categories === [])
//     return { props: { products: [] } };

//   const session = await getSession();
//   const products = jsonify(await getProducts());
//   return { props: { products } };
// }
