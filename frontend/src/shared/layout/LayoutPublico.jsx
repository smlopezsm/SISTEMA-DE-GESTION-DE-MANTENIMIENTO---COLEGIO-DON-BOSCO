// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// function LayoutPublico() {
//   return (
//     <>
//       <Navbar />

//       <main>
//         <Outlet />
//       </main>

//       <Footer />
//     </>
//   );
// }

// export default LayoutPublico;

import { Outlet } from "react-router-dom";

function LayoutPublico() {
  return (
    <>
      <h1>LAYOUT FUNCIONA</h1>
      <Outlet />
    </>
  );
}

export default LayoutPublico;
