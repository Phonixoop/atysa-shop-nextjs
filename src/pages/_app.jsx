import "./globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Scrollbar } from "smooth-scrollbar-react";
// import { Provider as NextAuthProvider } from 'next-auth/client'
import ProgressBar from "@badrap/bar-of-progress";
import AuthProvider from "features/auth";
import { withSessionSsr } from "lib/withSession";

const progress = new ProgressBar({
  size: 2,
  color: "#38a169",
  className: "bar-of-progress",
  delay: 100,
});
export default function MyApp({
  Component,
  pageProps: { user, ...pageProps },
}) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", progress.start);
    router.events.on("routeChangeComplete", progress.finish);
    router.events.on("routeChangeError", progress.finish);

    return () => {
      router.events.off("routeChangeStart", progress.start);
      router.events.off("routeChangeComplete", progress.finish);
      router.events.off("routeChangeError", progress.finish);
    };
  }, [router]);
  console.log({ user });
  return (
    <AuthProvider>
      {Component.PageLayout ? (
        <Component.PageLayout>
          <Component {...pageProps} />
        </Component.PageLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
