import { FC } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
  return (
    <div className="layout">
      <div className="layout__header"></div>
      <div className="layout__main">
        <Outlet />
      </div>
      <div className="layout__footer"></div>
    </div>
  );
};

export { Layout };
