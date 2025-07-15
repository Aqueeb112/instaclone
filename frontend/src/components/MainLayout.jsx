import { Home } from "lucide-react";
import React from "react";
import { Outlet } from "react-router-dom";
import LeftSlidebar from "./LeftSlidebar";

const MainLayout = () => {
  return (
    <div>
      <LeftSlidebar  />
      <Outlet>
        <Home></Home>
      </Outlet>
    </div>
  );
};

export default MainLayout;
