const NavPanel = ({ children }) => {
  return (
    <div
      className="
        fixed inset-0
        bg-white/[0.06]
        backdrop-blur-xl
      "
    >
      {children}
    </div>
  );
};

export default NavPanel;
