import React, { useState, useEffect } from "react";
import { Button, InputNumber, Slider } from "antd";
import {
  storage,
  doc,
  setDoc,
  database,
  ref,
  set,
  onValue,
} from "../../../services/firebase";

import { notification } from "antd";
import { ACTION_DB, STATUS_UPDATE_THRESHOLD } from "../../../utils/constant";

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

const SensorsThreshold = () => {
  const [temperature, setTemperature] = useState([0, 100]);
  const [humidity, setHumidity] = useState([0, 100]);
  const [updateSuccess, setUpdateSucces] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);

  useEffect(() => {
    onValue(ref(database, "threshold"), (snapshot) => {
      const data = snapshot.val();

      console.log(pushNotification);

      if (data.status === STATUS_UPDATE_THRESHOLD.UPDATED) {
        setPushNotification(true);
        set(ref(database, "threshold"), {
          ...data,
          status: STATUS_UPDATE_THRESHOLD.NO_UPDATE,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (pushNotification) {
      setPushNotification(false);
      pushNotificationUpdate();
    }
  }, [pushNotification]);

  const onAfterChangeTemperature = (value) => {
    setTemperature(value);
  };

  const onAfterChangeHumidity = (value) => {
    setHumidity(value);
  };

  const updateTemperatureThreshold = () => {
    updateSettingSensors();
    set(ref(database, "action"), ACTION_DB.UPDATE_TEMPERATURE_THRESHOLD)
      .then(() => {
        setUpdateSucces(true);
      })
      .catch((error) => {
        setUpdateSucces(false);
      });

    set(ref(database, "threshold"), {
      min: temperature[0],
      max: temperature[1],
      status: STATUS_UPDATE_THRESHOLD.WAITTING,
    })
      .then(() => {
        setUpdateSucces(true);
      })
      .catch((error) => {
        setUpdateSucces(false);
      });
  };

  const updateHumidityThreshold = () => {
    updateSettingSensors();
    set(ref(database, "action"), ACTION_DB.UPDATE_HUMIDITY_THRESHOLD)
      .then(() => {
        setUpdateSucces(true);
      })
      .catch((error) => {
        setUpdateSucces(false);
      });

    set(ref(database, "threshold"), {
      min: humidity[0],
      max: humidity[1],
      status: STATUS_UPDATE_THRESHOLD.WAITTING,
    })
      .then(() => {
        setUpdateSucces(true);
      })
      .catch((error) => {
        setUpdateSucces(false);
      });
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
          setUpdateSucces(true);
        })
        .catch((error) => {
          setUpdateSucces(false);
        });
    } catch (e) {
      setUpdateSucces(false);
    }
  };

  const pushNotificationUpdate = () => {
    if (updateSuccess) {
      notification.success({
        message: "Success",
        description: `Setting sensors updated`,
        duration: 3,
      });
    } else {
      notification.error({
        message: "Error",
        description: `Setting sensors updated failed`,
        duration: 3,
      });
    }
  };

  return (
    <div className="flex-1 w-full h-full">
      <div className="w-full h-auto flex flex-col justify-center items-center p-10">
        <h1 className="text-2xl font-bold">Temperature</h1>
        <Slider
          className="w-full h-full"
          range
          marks={marksTemperature}
          onAfterChange={onAfterChangeTemperature}
          onChange={onAfterChangeTemperature}
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
          <div className="flex flex-col justify-center items-center p-10">
            <Button type="primary" onClick={updateTemperatureThreshold}>
              Save
            </Button>
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
          onChange={onAfterChangeHumidity}
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
          <div className="flex flex-col justify-center items-center p-10">
            <Button type="primary" onClick={updateHumidityThreshold}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorsThreshold;
