import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full ">
      <Head />
      <body className="h-full">
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
