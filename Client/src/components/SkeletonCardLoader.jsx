const SkeletonCardLoader = ({ count = 6 }) => {
  return (
    <div className="flex gap-4 px-6 mt-6 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[130px] sm:w-[150px] lg:w-[180px]"
        >
          {/* Poster Skeleton */}
          <div
            className="
              h-[190px] sm:h-[220px] lg:h-[260px]
              rounded-2xl 
              bg-gradient-to-br from-white/5 to-white/10
              animate-pulse
            "
          />

          {/* Title Skeleton */}
          <div className="mt-3 h-4 w-3/4 rounded bg-white/10 animate-pulse" />

          {/* Rating Skeleton */}
          <div className="mt-2 h-3 w-1/2 rounded bg-white/10 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonCardLoader;
