import React from "react";
import { HumidityAlert, TemperatureAlert } from "../../components/Alert";

const Alert = () => {
  return (
    <div className="w-full h-full flex flex-row">
      <TemperatureAlert />
      <HumidityAlert />
    </div>
  );
};

export default Alert;
