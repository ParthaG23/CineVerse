import { memo } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-black">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col overflow-hidden">

        {/* Top Navigation */}
        <TopBar />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar will-change-scroll">

          {/* Page Content */}
          <main className="px-4 lg:px-6 max-w-[1200px] mx-auto pb-10">
            {children}
          </main>

          {/* Footer */}
          <Footer />

        </div>
      </div>
    </div>
  );
};

export default memo(Layout);