

export default function CategoryList({ services, onSelectCategory}){
    return(
        <div className="category-list">
      <h2>Categories</h2>
      <ul>
        {services.map((category) => (
          <li key={category.id}>
            <button onClick={() => onSelectCategory(category.name)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
