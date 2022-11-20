export default function ProductCategoryList({ categories = [] }) {
  return (
    <>
      <div className="flex gap-2">
        {categories.map((category) => {
          return (
            <h4
              key={category.id}
              className="text-sm font-bold text-green-700 bg-green-100 p-2 rounded-md"
            >
              {category.name}
            </h4>
          );
        })}
      </div>
    </>
  );
}
