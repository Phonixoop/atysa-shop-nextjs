import React, { useEffect, useMemo, useState } from "react";

export default function MmdPage({ categories }) {
  const [data, setData] = useState({});

  return <div className="flex flex-col">{JSON.stringify(data, null, 2)}</div>;
}

export function getServerSideProps() {
  const categories = [
    {
      name: "sadsa",
      label: "sadasd",
    },
    {
      name: "sasadsadadsa",
    },
  ];
  return {
    props: { categories },
  };
}
