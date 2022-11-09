import { useState } from "react";

export default function MultiBox({
  initialKeys = [],
  list = [],
  min = 0,
  max = undefined,
  multiple = false,
  onClick = () => {},
  onContextMenu = () => {},
  renderItem = () => {},
}) {
  if (initialKeys.length < min)
    throw new Error(
      "initialKeys must be more or equal to min value which is " + min
    );

  const [selectedKeys, setSelectedKeys] = useState(
    initialKeys.map((item) => item.id)
  );
  const isSelected = (item) => selectedKeys.includes(item.key);

  function handleChange(item) {
    if (selectedKeys.length > (max || list.length)) return;
    const { key } = item;
    setSelectedKeys((prevKeys) => {
      return multiple
        ? prevKeys.includes(item.key)
          ? [...prevKeys.filter((key) => key !== item.key)]
          : [...prevKeys, item.key]
        : [key];
    });
  }
  function handleClick(item) {
    handleChange(item);
    onClick(item.value);
  }
  function handleContextMenu(e, item) {
    e.preventDefault();
    handleChange(item);
    onContextMenu(item.value);
  }
  return (
    <>
      {list
        .map((item) => {
          return {
            key: item.id,
            value: item,
          };
        })
        .map((item) => {
          return (
            <div
              key={item.key}
              onClick={() => handleClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {renderItem(item.value, isSelected(item))}
            </div>
          );
        })}
    </>
  );
}
