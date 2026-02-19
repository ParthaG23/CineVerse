import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Player = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  if (!key) return null;

  return (
    <div >

      {/* Rounded Background Container */}
      <div className="relative w-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)]">

        {/* Back Button (Above iframe) */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white hover:text-yellow-400 transition"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Video */}
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${key}?autoplay=1&modestbranding=1&rel=0&controls=1`}
            title="Trailer"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>

      </div>
    </div>
  );
};

export default Player;
