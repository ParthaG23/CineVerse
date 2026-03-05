import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /* 
        Demo register flow
        Later you can replace with API call
      */

      const userData = {
        name: form.name,
        email: form.email,
      };

      login(userData);

      navigate("/");
    } catch (err) {
      console.error("Register Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen 
        flex items-center justify-center
        bg-black relative overflow-hidden px-4
      "
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]" />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-md
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
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Join <span className="text-yellow-400">CineVerse</span>
        </h2>

        <p className="text-sm text-gray-400 text-center mb-8">
          Create your account and start streaming instantly
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your full name"
              className="
                w-full p-3 rounded-xl
                bg-black/50 border border-white/10
                text-white placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Email Address
            </label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="
                w-full p-3 rounded-xl
                bg-black/50 border border-white/10
                text-white placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
              "
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-xs text-gray-400 mb-1 block">
              Password
            </label>

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="
                w-full p-3 rounded-xl
                bg-black/50 border border-white/10
                text-white placeholder:text-gray-500
                focus:outline-none
                focus:border-yellow-400
                focus:ring-1 focus:ring-yellow-400
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Register Button */}
          <button
            disabled={loading}
            className="
              w-full py-3 mt-2
              bg-yellow-400 text-black font-semibold
              rounded-xl
              hover:bg-yellow-300
              active:scale-[0.98]
              transition
              shadow-lg shadow-yellow-400/20
              disabled:opacity-70
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[11px] text-gray-500 text-center mt-5">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Login */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-yellow-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-center mt-6 text-gray-500">
          Unlimited Movies • Web Series • Anime • Regional Content
        </p>
      </div>
    </div>
  );
};

export default Register;