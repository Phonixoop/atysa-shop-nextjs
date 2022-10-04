export default function List({
  list = [],
  className = "",
  renderItem = () => {},
}) {
  return (
    <div className={className}>
      {list.map((item, i) => renderItem(item, i))}
    </div>
  );
}
