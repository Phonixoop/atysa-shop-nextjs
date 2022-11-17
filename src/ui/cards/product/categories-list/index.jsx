export default function CategoryList({ categories = [] }) {
  return (
    <>
      <div className="flex gap-2">
        {categories.map((category) => {
          return (
            <h4 key={category.id} className="text-sm font-bold text-green-700">
              {category.name}
            </h4>
          );
        })}
      </div>
    </>
  );
}
