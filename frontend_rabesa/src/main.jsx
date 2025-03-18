import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Login from "./components/Login";
// import PaginaError from "./pages/PaginaError";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    // errorElement: <PaginaError />,
    children: [
      {
        // path: "shows/:showId",
        // element: <Show />
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
