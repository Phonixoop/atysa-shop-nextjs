import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

export default function MePage() {
  return <ProfileLayout></ProfileLayout>;
}

MePage.PageLayout = MainLayout;
