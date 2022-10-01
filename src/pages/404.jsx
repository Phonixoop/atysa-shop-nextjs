import MainLayout from "layouts/mainLayout";
import React from "react";

export default function NotFoundPage() {
  return (
    <div className=" w-full h-scren flex justify-center items-center  text-center">
      <h1 className="text-6xl">404</h1>
    </div>
  );
}

NotFoundPage.PageLayout = MainLayout;
