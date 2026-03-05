import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  const name = user?.name || "Guest User";
  const email = user?.email || "guest@email.com";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black px-6 py-10">

      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-6 mb-8">

          <div className="
            w-24 h-24 rounded-full
            bg-yellow-400 text-black
            flex items-center justify-center
            text-3xl font-bold
            shadow-lg shadow-yellow-400/30
          ">
            {initial}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {name}
            </h2>

            <p className="text-gray-400">
              {email}
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="
            bg-black/40 p-5 rounded-xl text-center
            border border-white/5 hover:border-yellow-400/30
            transition
          ">
            <p className="text-gray-400 text-sm">Plan</p>
            <h3 className="font-semibold mt-1 text-white">
              Premium
            </h3>
          </div>

          <div className="
            bg-black/40 p-5 rounded-xl text-center
            border border-white/5 hover:border-yellow-400/30
            transition
          ">
            <p className="text-gray-400 text-sm">Watch Time</p>
            <h3 className="font-semibold mt-1 text-white">
              120 hrs
            </h3>
          </div>

          <div className="
            bg-black/40 p-5 rounded-xl text-center
            border border-white/5 hover:border-yellow-400/30
            transition
          ">
            <p className="text-gray-400 text-sm">Favorites</p>
            <h3 className="font-semibold mt-1 text-white">
              28 Movies
            </h3>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">

          <button className="
            px-6 py-3
            bg-yellow-400 text-black
            rounded-lg font-semibold
            hover:bg-yellow-300
            transition
          ">
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="
              px-6 py-3
              bg-red-600 text-white
              rounded-lg font-semibold
              hover:bg-red-500
              transition
            "
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;