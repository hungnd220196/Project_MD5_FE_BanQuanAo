import { Outlet } from "react-router-dom";
import "./index.scss";
import Menu from "./menu";
import MenuAdmin from "./menu";
import { theme } from "antd";

export default function LayoutIndex() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <div className="ra-admin-layout">
        <MenuAdmin/>
      </div>
    </>
  );
}
