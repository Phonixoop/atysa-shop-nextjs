import React from "react";
// featuer layouts
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import AuthProvider from "features/auth";

export default function WithProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
