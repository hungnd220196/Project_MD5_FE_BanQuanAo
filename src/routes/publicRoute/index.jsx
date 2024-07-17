import About from "../../pages/users/about";
import Contact from "../../pages/users/contact";
import Home from "../../pages/users/home";
import Login from "../../pages/users/login";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default publicRoutes;
