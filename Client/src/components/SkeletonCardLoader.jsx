import { memo } from "react";

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
              relative overflow-hidden
              h-[190px] sm:h-[220px] lg:h-[260px]
              rounded-2xl bg-white/5
            "
          >
            <div
              className="
                absolute inset-0
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
                animate-[shimmer_1.4s_infinite]
              "
            />
          </div>

          {/* Title Skeleton */}
          <div className="relative mt-3 h-4 w-3/4 rounded bg-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.4s_infinite]" />
          </div>

          {/* Rating Skeleton */}
          <div className="relative mt-2 h-3 w-1/2 rounded bg-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.4s_infinite]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(SkeletonCardLoader);