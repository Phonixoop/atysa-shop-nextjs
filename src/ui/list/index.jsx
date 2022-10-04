export default function List({ list = [], renderItem = () => {} }) {
  return <>{list.map((item, i) => renderItem(item, i))}</>;
}
