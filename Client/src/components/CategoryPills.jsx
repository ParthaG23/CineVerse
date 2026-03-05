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
  const buttonRefs = useRef({});

  /* AUTO SCROLL ACTIVE PILL */
  useEffect(() => {
    const activeBtn = buttonRefs.current[active];
    if (!activeBtn) return;

    activeBtn.scrollIntoView({
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
          flex gap-3 overflow-x-auto
          no-scrollbar scroll-smooth
          pb-1
        "
      >
        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              ref={(el) => (buttonRefs.current[cat] = el)}
              onClick={() => onChange(cat)}
              aria-pressed={isActive}
              className={`
                flex-shrink-0
                px-4 py-2
                rounded-full
                text-sm whitespace-nowrap
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-yellow-400
                ${
                  isActive
                    ? "bg-white text-black shadow-md scale-[1.05]"
                    : "bg-black/30 text-white/70 hover:bg-white/10 hover:text-white"
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

export default memo(CategoryPills);