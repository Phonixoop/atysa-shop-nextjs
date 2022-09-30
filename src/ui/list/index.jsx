import React from "react";

export function List({ list = [], renderItem = () => {} }) {
  return list.map((item) => renderItem(item));
}
