import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

const Player = () => {
const { key } = useParams();
const navigate = useNavigate();
const [loaded, setLoaded] = useState(false);

if (!key) {
return ( <div className="min-h-screen flex items-center justify-center bg-black text-white">
Invalid video </div>
);
}

return ( <div className="min-h-screen flex flex-col items-center bg-black px-4 py-8">

```
  {/* Back Button */}
  <div className="w-full max-w-6xl mb-4">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 
      px-4 py-2 rounded-full transition"
    >
      <FaArrowLeft />
      Back
    </button>
  </div>

  {/* Player */}
  <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg bg-black">
    <div className="aspect-video relative">

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title="Trailer Player"
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
    </div>
  </div>
</div>


);
};

export default Player;
