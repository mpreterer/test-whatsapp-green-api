import { Route, Routes } from "react-router-dom";

import { Layout } from "../components/Layout/Layout";

import { Login } from "../pages/Login/Login";
import { Messenger } from "../pages/Messenger/Messenger";
import { SCREENS } from "./endpoints";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={SCREENS.MESSENGER} element={<Messenger />} />
        <Route path={SCREENS.LOGIN} element={<Login />} />
        <Route path={SCREENS.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
