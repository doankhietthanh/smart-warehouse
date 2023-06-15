import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

import {
  SensorsThreshold,
  VacantPosition,
  VehicleList,
} from "../../components/Settings";

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
  getItemMenu("Sensors Threshold", "sensors_threshold", <PieChartOutlined />),
  getItemMenu("Vehicle List", "vehicle_list", <DesktopOutlined />),
  getItemMenu("Vacant Position", "vacant_position", <ContainerOutlined />),
];

const Settings = () => {
  const [layout, setLayout] = useState("sensors_threshold");

  const hanlderClickMenu = (item) => {
    console.log(item.key);
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
        {layout === "sensors_threshold" && <SensorsThreshold />}
        {layout === "vacant_position" && <VacantPosition />}
        {layout === "vehicle_list" && <VehicleList />}
      </div>
    </div>
  );
};

export default Settings;
