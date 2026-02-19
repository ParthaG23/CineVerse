const CategoryPills = ({ active, onChange }) => {
  const categories = [
    "Trending",
    "Adventure",
    "Action",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
  ];

  return (
    <div className="px-6 mt-6">
      <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              px-4 py-2 rounded-full text-sm whitespace-nowrap transition flex-shrink-0
              ${
                active === cat
                  ? "bg-white text-black"
                  : "bg-black/30 text-white/70 hover:bg-white/10"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPills;
