import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import Map from "ui/map";
export default function TestPage() {
  // const Map = dynamic(() => import("ui/map"));
  const [address, setAddress] = useState();
  return (
    <>
      <Map
        onChange={({ lat, lon }) => {
          setAddress({
            lat,
            lon,
          });
        }}
      />

      {JSON.stringify(address)}
    </>
  );
}
