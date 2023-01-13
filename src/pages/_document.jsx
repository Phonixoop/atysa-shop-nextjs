import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html className="h-full ">
      <Head>
        {/* <link rel="shortcut icon" href={favicon} /> */}
        <link rel="shortcut icon" href="/icons/main/atysa.svg" />
      </Head>

      <body className="h-full overflow-overlay">
        <Main />
        <div
          id="portal"
          style={{
            overflow: "hidden",
          }}
        ></div>
        <div
          id="user-nav"
          style={{
            position: "sticky",
            bottom: "25px",
            marginTop: "25px",
            zIndex: "1000",
          }}
        ></div>
        <dir id="toast"></dir>

        <NextScript />
      </body>
    </Html>
  );
}
/*

        <Scrollbar
          plugins={{
            overscroll: {
              effect: "glow",
            },
          }}
        >
        */
