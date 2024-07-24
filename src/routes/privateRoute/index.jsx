import PrivateRoute from "../../features/protectedRouter/PrivateRoute";
import LayoutIndex from "../../layouts/admin";
import BannerAdmin from "../../pages/admin/banner";
import Category from "../../pages/admin/category";
import DashBoard from "../../pages/admin/dashboard";
import Orders from "../../pages/admin/orders";
import Product from "../../pages/admin/products";
import Users from "../../pages/admin/users";


const privateRoutes = [
  {
    path: "/admin",
    element: <PrivateRoute element={<LayoutIndex />} />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: "orders",
        element: <Orders/>,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "category",
        element: <Category/>,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "banners",
        element: <BannerAdmin/>,
      },
    ],
  },
];

export default privateRoutes;
