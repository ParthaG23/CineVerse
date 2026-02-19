import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* 🧭 Sidebar (Fixed for better performance) */}
      <Sidebar />

      {/* 📦 Main Content Area */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* 🔝 TopBar (Sticky improves UX) */}
        <div className="sticky top-0 z-40">
          <TopBar />
        </div>

        {/* 🧱 Scrollable Page Content */}
        <main
          className="
            flex-1 
            px-4 sm:px-6 
            max-w-[1200px] 
            w-full 
            mx-auto 
            pb-12 
            overflow-x-hidden
          "
        >
          {children}
        </main>

        {/* 🔻 Footer (Separated for better rendering performance) */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
