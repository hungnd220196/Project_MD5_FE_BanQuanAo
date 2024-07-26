
import About from "../../pages/users/about";
import Contact from "../../pages/users/contact";

import Login from "../../pages/login";
import Register from "../../pages/register";
import HomeIndex from "../../pages/homePage";
import ProductDetail from "../../pages/productDetail";

const publicRoutes = [
  {
    path: "/",
    element: <HomeIndex />,
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
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/productDetail/:id",
    element: <ProductDetail />,
  },
];

export default publicRoutes;
