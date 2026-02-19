import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-56 min-h-screen overflow-y-auto no-scrollbar">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main className="px-4 lg:px-6 max-w-[1200px] mx-auto pb-10">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
