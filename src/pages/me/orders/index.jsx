import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

export default function OrdersPage() {
  return <ProfileLayout>orders</ProfileLayout>;
}

OrdersPage.PageLayout = MainLayout;
