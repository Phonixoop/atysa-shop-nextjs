import "./globals.css";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

import { BasketProvider } from "context/basketContext";
import { MeProvider } from "context/meContext";

import { SessionProvider, useSession } from "next-auth/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Provider as NextAuthProvider } from 'next-auth/client'
import ProgressBar from "@badrap/bar-of-progress";
import Head from "next/head";
import UserNav from "ui/user-nav";

const progress = new ProgressBar({
  size: 2,
  color: "#38a169",
  className: "bar-of-progress",
  delay: 100,
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [queryClient] = useState(() => new QueryClient());
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

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <MeProvider>
            <Head>
              <title>آتیسا</title>
            </Head>

            <BasketProvider>
              <>
                {Component.PageLayout ? (
                  <>
                    {Component.auth ? (
                      <Auth auth={Component.auth}>
                        <Component.PageLayout>
                          <Component {...pageProps} />
                        </Component.PageLayout>
                      </Auth>
                    ) : (
                      <Component.PageLayout>
                        <Component {...pageProps} />
                      </Component.PageLayout>
                    )}
                    <UserNav />
                  </>
                ) : (
                  <>
                    {Component.auth ? (
                      <Auth auth={Component.auth}>
                        <Component {...pageProps} />
                      </Auth>
                    ) : (
                      <Component {...pageProps} />
                    )}
                    <UserNav />
                  </>
                )}
              </>
            </BasketProvider>
          </MeProvider>
        </Hydrate>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Auth({ children, auth = {} }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return auth.loading;
  }

  return children;
}
