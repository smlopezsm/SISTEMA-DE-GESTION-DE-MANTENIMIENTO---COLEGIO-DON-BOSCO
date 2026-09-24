import { Outlet } from "react-router";
import Navbar from "./Navbar";

function LayoutPublico() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutPublico;