import React from "react";

export default function UserNamePage({ name }) {
  return <div>{name}</div>;
}

export function getServerSideProps(context) {
  const { name } = context.params;
  return {
    props: { name },
  };
}
