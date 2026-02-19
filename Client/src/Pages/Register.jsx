import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Add backend register logic
    } catch (err) {
      console.error("Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen 
        flex items-center justify-center
        bg-black
        relative
        overflow-hidden
        px-4
      "
    >
      {/* 🎬 Cinematic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]" />

      {/* 🎥 Register Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          bg-black/70 backdrop-blur-2xl
          border border-white/10
          rounded-3xl
          p-8 sm:p-10
          shadow-[0_0_60px_rgba(0,0,0,0.8)]
        "
      >
        {/* 🎬 Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* 🎞 Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">
          Join <span className="text-yellow-400">CineVerse</span>
        </h2>

        <p className="text-sm text-gray-400 text-center mb-8">
          Create your account and start streaming instantly
        </p>

        {/* 📝 Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
              className="
                w-full p-3 rounded-xl
                bg-black/50
                border border-white/10
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
                transition
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="
                w-full p-3 rounded-xl
                bg-black/50
                border border-white/10
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
                transition
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              required
              className="
                w-full p-3 rounded-xl
                bg-black/50
                border border-white/10
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
                transition
              "
            />
          </div>

          {/* 🎬 OTT Style Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 mt-2
              bg-yellow-400 text-black font-semibold
              rounded-xl
              hover:bg-yellow-300
              active:scale-[0.98]
              transition-all duration-200
              shadow-lg shadow-yellow-400/20
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* 🔐 Terms */}
        <p className="text-[11px] text-gray-500 text-center mt-5 leading-relaxed">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* 🔁 Login Redirect */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-yellow-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>

        {/* 🎬 Footer Note */}
        <p className="text-[11px] text-center mt-6 text-gray-500">
          Unlimited Movies • Web Series • Anime • Regional Content
        </p>
      </div>
    </div>
  );
};

export default Register;
