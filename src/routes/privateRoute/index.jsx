import PrivateRoute from "../../features/protectedRouter/PrivateRoute";
import LayoutIndex from "../../layouts/admin";
import BannerAdmin from "../../pages/admin/banner";
import Category from "../../pages/admin/category";
import CommentManagement from "../../pages/admin/comment";
import Comment from "../../pages/admin/comment";
import Coupons from "../../pages/admin/coupons";
import DashBoard from "../../pages/admin/dashboard";
import Orders from "../../pages/admin/orders";
import Product from "../../pages/admin/products";
import Reviews from "../../pages/admin/reviews";
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
      {
        path: "coupons",
        element: <Coupons/>,
      },
      {
        path: "comments",
        element: <CommentManagement/>,
      },
      {
        path: "reviews",
        element: <Reviews/>,
      },
    ],
  },
];

export default privateRoutes;
