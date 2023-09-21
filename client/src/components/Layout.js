import Navbar from "./Navbar";

const Layout = ({ navbar = true, children }) => {
  return (
    <>
      {navbar && <Navbar />}
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
