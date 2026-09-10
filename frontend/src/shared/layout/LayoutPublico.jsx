import Navbar from "./Navbar";
import Footer from "./Footer";

function LayoutPublico({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default LayoutPublico;
