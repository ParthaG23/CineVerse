import { useEffect, useState } from "react";
import Banner from "./Banner";

const BannerCarousel = ({ movies }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full">
      <Banner movie={movies[index]} />
    </div>
  );
};

export default BannerCarousel;
