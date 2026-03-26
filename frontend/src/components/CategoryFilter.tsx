interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  /* Allows the user to filter by category by using radio buttons so you can only filter one at a time. */
  return (
    <div className="text-start">
      <h6 className="fw-bold small">Filter by Category</h6>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="category"
          id="cat-all"
          value=""
          checked={selectedCategory === ''}
          onChange={() => onCategoryChange('')}
        />
        <label className="form-check-label small" htmlFor="cat-all">
          All Categories
        </label>
      </div>
      {categories.map((category) => (
        <div className="form-check" key={category}>
          <input
            className="form-check-input"
            type="radio"
            name="category"
            id={`cat-${category}`}
            value={category}
            checked={selectedCategory === category}
            onChange={() => onCategoryChange(category)}
          />
          <label className="form-check-label small" htmlFor={`cat-${category}`}>
            {category}
          </label>
        </div>
      ))}
    </div>
  );
}

export default CategoryFilter;
