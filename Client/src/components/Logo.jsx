import { Link } from "react-router-dom";
import { PiFilmSlateBold } from "react-icons/pi";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <PiFilmSlateBold 
        size={36} 
        className="text-yellow-400 group-hover:rotate-6 transition" 
      />
      <span className="text-white font-extrabold text-2xl tracking-wide">
        CineVerse
      </span>
    </Link>
  );
};

export default Logo;
