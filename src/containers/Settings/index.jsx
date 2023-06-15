import React, { useState } from "react";
import { Button, InputNumber, Slider } from "antd";
import { storage, doc, setDoc } from "../../services/firebase";
import { notification } from "antd";

const marksTemperature = {
  0: "0°C",
  100: {
    style: {
      color: "#f50",
    },
    label: <strong>100°C</strong>,
  },
};

const marksHumidity = {
  0: "0%",
  100: {
    style: {
      color: "#f50",
    },
    label: <strong>100%</strong>,
  },
};

const Settings = () => {
  const [temperature, setTemperature] = useState([0, 100]);
  const [humidity, setHumidity] = useState([0, 100]);

  const onAfterChangeTemperature = (value) => {
    setTemperature(value);
  };

  const onAfterChangeHumidity = (value) => {
    setHumidity(value);
  };

  const updateSettingSensors = () => {
    try {
      setDoc(doc(storage, "settings", "sensors"), {
        temperature: {
          min: temperature[0],
          max: temperature[1],
        },
        humidity: {
          min: humidity[0],
          max: humidity[1],
        },
      })
        .then(() => {
          console.log("Document successfully written!");
          notification.success({
            message: "Success",
            description: `Setting sensors updated`,
            duration: 3,
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          notification.error({
            message: "Error",
            description: `Setting sensors updated failed`,
            duration: 3,
          });
        });
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Error",
        description: `Setting sensors updated failed`,
        duration: 3,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-row gap-5">
      <div className="flex-1 w-full h-full">
        <div className="w-full h-auto flex flex-col justify-center items-center p-10">
          <h1 className="text-2xl font-bold">Temperature</h1>
          <Slider
            className="w-full h-full"
            range
            marks={marksTemperature}
            onAfterChange={onAfterChangeTemperature}
            value={temperature}
          />
          <div className="w-full h-auto flex gap-10 justify-center items-center">
            <div className="flex gap-5 justify-center items-center">
              <label className="font-bold">Min</label>
              <InputNumber
                min={0}
                max={100}
                defaultValue={0}
                value={temperature[0]}
                onChange={(value) => {
                  setTemperature([value, temperature[1]]);
                }}
              />
            </div>
            <div className="flex gap-5 justify-center items-center">
              <label className="font-bold">Max</label>
              <InputNumber
                min={0}
                max={100}
                defaultValue={100}
                value={temperature[1]}
                onChange={(value) => {
                  setTemperature([temperature[0], value]);
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center p-10">
          <h1 className="text-2xl font-bold">Humidity</h1>
          <Slider
            className="w-full h-full"
            range
            marks={marksHumidity}
            onAfterChange={onAfterChangeHumidity}
            value={humidity}
          />
          <div className="w-full h-auto flex gap-10 justify-center items-center">
            <div className="flex gap-5 justify-center items-center">
              <label className="font-bold">Min</label>
              <InputNumber
                min={0}
                max={100}
                defaultValue={80}
                value={humidity[0]}
                onChange={(value) => {
                  setHumidity([value, humidity[1]]);
                }}
              />
            </div>
            <div className="flex gap-5 justify-center items-center">
              <label className="font-bold">Max</label>
              <InputNumber
                min={0}
                max={100}
                defaultValue={100}
                value={humidity[1]}
                onChange={(value) => {
                  setHumidity([humidity[0], value]);
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center p-10">
          <Button type="primary" onClick={updateSettingSensors}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full h-full"></div>
    </div>
  );
};

export default Settings;
