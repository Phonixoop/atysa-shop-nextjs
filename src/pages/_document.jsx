import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html className="h-full ">
      <Head></Head>
      <body className="h-full overflow-overlay">
        <Main />
        <div id="portal"></div>
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
