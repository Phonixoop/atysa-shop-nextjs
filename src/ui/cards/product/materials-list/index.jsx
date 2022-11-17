import Tag from "ui/tag";
export default function MaterialsList({
  className = "relative flex flex-row justify-center items-center gap-2 ",
  list = [],
  max,
}) {
  return (
    <div className={className}>
      {list.length > 0 && (
        <>
          {list.slice(0, max || list.length - 1).map((item) => {
            return <Tag key={item.id}>{item.name}</Tag>;
          })}
        </>
      )}
    </div>
  );
}
