import { useEffect, useMemo, useState } from "react";

export default function MultiBox({
  initialKeys = [],
  list = [],
  min = 0,
  max = undefined,
  multiple = false,
  onClick = () => {},
  onContextMenu = () => {},
  onChange = () => {},
  renderItem = (value, isSelected = () => {}) => value,
}) {
  const listWithKey = useMemo(
    () =>
      list.map((item) => {
        return {
          key: item?.id,
          value: item,
        };
      }),
    [list]
  );
  const [selectedKeys, setSelectedKeys] = useState(
    initialKeys.map((item) => item.id || item)
  );
  const isSelected = (item) => selectedKeys.includes(item.key);

  function handleChange(item) {
    if (selectedKeys.length > (max || list.length)) return;
    const { key } = item;
    if (selectedKeys.includes(key) && selectedKeys.length <= min) return;
    setSelectedKeys((prevKeys) => {
      return multiple
        ? prevKeys.includes(item.key)
          ? [...prevKeys.filter((key) => key !== item.key)]
          : [...prevKeys, item.key]
        : [key];
    });
  }
  function handleClick(e, item) {
    handleChange(item);
    onClick(item.value);
  }
  function handleContextMenu(e, item) {
    e.preventDefault();
    onContextMenu(item.value);
  }

  useEffect(() => {
    onChange(
      listWithKey
        .filter((item) => {
          return selectedKeys.some((element) => {
            return element === item.key;
          });
        })
        .map((item) => item.value)
    );
  }, [selectedKeys]);

  return (
    <>
      {listWithKey.map((item) => {
        return (
          <div
            className="w-auto h-auto p-0 m-0 bg-transparent outline-none border-none"
            key={item.key}
            onClick={(e) => {
              handleClick(e, item);
            }}
            onContextMenu={(e) => {
              console.log(e.button);
              handleContextMenu(e, item);
            }}
          >
            {renderItem(item.value, isSelected(item))}
          </div>
        );
      })}
    </>
  );
}
