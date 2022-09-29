import MainLayout from "@/layouts/mainLayout";

// next auth

import { useSession } from "next-auth/react";

export default function HomePage({ props }) {
  const session = useSession();

  return (
    <div className="h-full bg-blue-50 min-h-full">
      {session && "welcome"}
      {!session && "you have to log in first"}
      <h1>Hello world.</h1>
    </div>
  );
}

HomePage.PageLayout = MainLayout;

// export async function getServerSideProps() {}
