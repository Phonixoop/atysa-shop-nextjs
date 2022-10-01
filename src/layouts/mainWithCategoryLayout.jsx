import CategoryList from "features/layouts/categoryList";
import { useFetch } from "hooks/useFetch";
import MainLayout from "@/layouts/mainLayout";
import React from "react";

export default function MainWithCategoryLayout({ children }) {
  const { data, loading, error } = useFetch("/api/categories");

  return (
    <>
      {loading
        ? "loading"
        : error
        ? JSON.stringify(error)
        : data
        ? JSON.stringify(data)
        : ""}
      {children}
    </>
  );
}

MainWithCategoryLayout.PageLayout = MainLayout;
