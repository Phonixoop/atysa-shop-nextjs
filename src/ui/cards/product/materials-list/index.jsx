import Tag from "ui/tag";

export default function MaterialsList({
  className = "relative flex flex-row justify-center items-center gap-2",
  itemClass = "text-[0.8rem]",
  withIcon = false,
  list = [],
  max,
}) {
  return (
    <div key={"hi"} className={className}>
      {list.length > 0 && (
        <>
          {list.slice(0, max || list.length).map((item) => {
            return (
              <>
                <Tag
                  key={item.id}
                  extraClass={itemClass}
                  iconUrl={
                    withIcon
                      ? `https://atysa.ir/icons/ingredients/${item.name}.png`
                      : ""
                  }
                >
                  <span>{item.name}</span>
                </Tag>
              </>
            );
          })}
        </>
      )}
    </div>
  );
}
