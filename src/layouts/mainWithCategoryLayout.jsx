import React, { useEffect, useState } from "react";
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import CategoryList from "features/categoryList";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/fetches";
export default function MainWithCategoryLayout({ children }) {
  const { data: categories } = useQuery(["categories"], getCategories, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Header>
        <CategoryList {...{ categories }} />
      </Header>
      <main className="flex flex-grow w-full h-full">{children}</main>
      <Footer />
    </>
  );
}
