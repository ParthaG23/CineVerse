import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import CineLoader from "../components/CineLoader";


/* 🚀 Lazy Loaded Pages (Performance Boost) */

const Home = lazy(() => import("../Pages/Home"));
const Search = lazy(() => import("../Pages/Search"));
const MovieDetails = lazy(() => import("../Pages/MovieDetails"));
const Player = lazy(() => import("../Pages/Player"));
const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));
const CategoryPage = lazy(() => import("../Pages/CategoryPage"));
const NotFoundPage=lazy(()=>import("../Pages/NotFound"));


const AppRoutes = () => {
  return (
    <Suspense fallback={<CineLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

        {/* Movie / TV */}
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<MovieDetails />} />

        {/* Player */}
        <Route path="/player/:key" element={<Player />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Categories */}
        <Route path="/category/:type" element={<CategoryPage />} />
        
        {/* not Found page  */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      
    </Suspense>
  );
};

export default AppRoutes;