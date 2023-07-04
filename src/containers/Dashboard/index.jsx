import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

import { History, Gates } from "../../components/Dashboard";

const getItemMenu = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

const itemsMenu = [
  getItemMenu("History", "history", <PieChartOutlined />),
  getItemMenu("Gates Dashboard", "gates", <ContainerOutlined />),
];

const Dashboard = () => {
  const [layout, setLayout] = useState("history");

  const hanlderClickMenu = (item) => {
    setLayout(item.key);
  };

  return (
    <div className="w-full h-full flex flex-row gap-5">
      <div className="w-auto h-full">
        <Menu
          className="w-full h-full"
          defaultSelectedKeys={[layout]}
          mode="inline"
          items={itemsMenu}
          onClick={hanlderClickMenu}
        />
      </div>
      <div className="flex-1 w-full h-full">
        {layout === "history" && <History />}
        {layout === "gates" && <Gates />}
      </div>
    </div>
  );
};

export default Dashboard;
