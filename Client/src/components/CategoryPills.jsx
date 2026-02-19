import { memo, useRef, useEffect } from "react";

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

const CategoryPills = ({ active, onChange }) => {
  const containerRef = useRef(null);

  // 🎯 Auto-scroll active pill into view (mobile UX boost)
  useEffect(() => {
    const activeBtn = containerRef.current?.querySelector(
      `[data-active="true"]`
    );
    activeBtn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  return (
    <div className="px-4 sm:px-6 mt-6">
      <div
        ref={containerRef}
        className="
          flex gap-3 overflow-x-auto no-scrollbar scroll-smooth
          pb-1
        "
      >
        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => onChange(cat)}
              aria-pressed={isActive}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-yellow-400
                ${
                  isActive
                    ? "bg-white text-black shadow-md"
                    : "bg-black/30 text-white/70 hover:bg-white/10"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 🧠 Memo prevents unnecessary re-renders (BIG performance win)
export default memo(CategoryPills);
