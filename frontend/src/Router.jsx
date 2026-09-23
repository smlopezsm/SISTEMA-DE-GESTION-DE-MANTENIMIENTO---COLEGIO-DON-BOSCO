// import { createBrowserRouter } from "react-router-dom";
// import LayoutPublico from "./shared/layout/LayoutPublico";
// import HomePage from "./features/home/pages/HomePage";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <LayoutPublico />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//     ],
//   },
// ]);

import { createBrowserRouter } from "react-router-dom";
import LayoutPublico from "./shared/layout/LayoutPublico";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublico />,
  },
]);
