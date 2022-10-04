// import React, { useEffect, useState } from "react";
// import useFetch from "use-http";
// import Header from "@/features/layouts/header";
// import Footer from "@/features/layouts/footer";
// import CategoryList from "features/layouts/categoryList";
// export default function MainWithCategoryLayout({ children }) {
//   const [data, setData] = useState([]);
//   const { get, response, loading, error } = useFetch("/api/", {});
//   useEffect(() => {
//     loadInitialTodos();
//   }, []); // componentDidMou
//   async function loadInitialTodos() {
//     const initialTodos = await get("/categories");
//     if (response.ok) setData(initialTodos);
//   }
//   return (
//     <>
//       <Header />
//       <main className="flex flex-grow w-full h-full">
//         {error && "Error!"}
//         {loading && "Loading..."}
//         {JSON.stringify(data)}
//         {children}
//       </main>
//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import useFetch from "hooks/useFetch";
import CategoryList from "features/categoryList";
export default function MainWithCategoryLayout({ children }) {
  const { value, loading, error } = useFetch("/api/categories", {});

  return (
    <>
      <Header>
        <CategoryList categories={value} />
      </Header>
      <main className="flex flex-grow w-full h-full">{children}</main>
      <Footer />
    </>
  );
}

// export async function getStaticProps() {
//   const categories = jsonify(await getCategories());
//   console.log("serer side for layout");
//   return {
//     props: { categories },
//   };
// }
