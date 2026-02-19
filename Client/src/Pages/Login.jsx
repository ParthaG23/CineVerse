import { Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const handleGoogleLogin = (response) => {
    console.log("Google JWT Token:", response.credential);
    // Later → send token to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-[350px] border border-white/10 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Login to continue watching
        </p>

        {/* Google Login */}
        <GoogleLoginButton onSuccess={handleGoogleLogin} />

        <div className="my-5 flex items-center gap-2">
          <hr className="flex-1 border-white/10" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-white/10" />
        </div>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-yellow-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-yellow-400"
          />

          <button className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
