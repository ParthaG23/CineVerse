import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

const Player = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid video
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-black">
      {/* 🎬 Rounded Cinematic Player Container */}
      <div className="relative w-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)]">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white hover:text-yellow-400 transition"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* 🎥 Video Wrapper */}
        <div className="aspect-video relative">
          
          {/* 🔥 Skeleton Loader (shows until iframe loads) */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* 🚀 Optimized YouTube Iframe */}
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${key}?autoplay=1&modestbranding=1&rel=0&controls=1&playsinline=1`}
            title="Trailer Player"
            loading="lazy"                 // ⚡ Performance boost
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)} // hide loader when ready
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
