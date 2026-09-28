import { Outlet, ScrollRestoration  } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";


function LayoutPublico() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

export default LayoutPublico;