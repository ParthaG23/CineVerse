import { Link } from "react-router-dom";
import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Logo from "../components/Logo";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);
      console.log("Google JWT Token:", response.credential);
      // Send token to backend later
    } catch (err) {
      console.error("Google Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Login attempt:", form);

      // TODO: backend login
      // await loginUser(form)

    } catch (err) {
      console.error("Login error:", err);
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
      "
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]" />

      {/* Login Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          mx-4
          bg-black/70 backdrop-blur-2xl
          border border-white/10
          rounded-3xl
          p-8 sm:p-10
          shadow-[0_0_60px_rgba(0,0,0,0.8)]
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">
          Sign In to <span className="text-yellow-400">CineVerse</span>
        </h2>

        <p className="text-sm text-gray-400 text-center mb-8">
          Unlimited movies, series & anime — all in one place
        </p>

        {/* Google Login */}
        <div className="mb-6">
          <GoogleLoginButton onSuccess={handleGoogleLogin} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-white/10" />
          <span className="text-xs text-gray-500 tracking-wider">OR</span>
          <hr className="flex-1 border-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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

          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
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

          {/* Login Button */}
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Options */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
          <button className="hover:text-yellow-400 transition">
            Forgot Password?
          </button>

          <button className="hover:text-yellow-400 transition">
            Need Help?
          </button>
        </div>

        {/* Sign Up */}
        <p className="text-sm text-center mt-8 text-gray-400">
          New to CineVerse?{" "}
          <Link
            to="/register"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Sign up now
          </Link>
        </p>

        {/* Footer Note */}
        <p className="text-[11px] text-center mt-6 text-gray-500">
          Secure login • OTT Experience • Cinematic UI
        </p>
      </div>
    </div>
  );
};

export default Login;