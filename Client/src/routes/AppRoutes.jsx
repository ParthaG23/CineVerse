import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Search from "../Pages/Search";
import MovieDetails from "../Pages/MovieDetails";
import Player from "../Pages/Player";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import CategoryPage from "../Pages/CategoryPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<MovieDetails />} />
      <Route path="/player/:key" element={<Player />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/category/:type" element={<CategoryPage />} />
    </Routes>
  );
};

export default AppRoutes;
