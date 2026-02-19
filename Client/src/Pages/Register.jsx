import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black px-4">

      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">

        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          Create Account
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          Join and start watching today
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-400"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-yellow-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
