import React, { useState, useEffect } from "react";
import { Alert as AlertAntd, Space, List, message } from "antd";
import VirtualList from "rc-virtual-list";
import {
  storage,
  deleteDoc,
  doc,
  getDocs,
  collection,
} from "../../services/firebase";
import { formatTime } from "../../utils/constant";

const calculateContainerHeight = () => {
  const vh = window.innerHeight * 0.01;
  return vh * 100;
};

const Alert = () => {
  const ContainerHeight = calculateContainerHeight();

  const [temperatureList, setTemperatureList] = useState([]);
  const [humidityList, setHumidityList] = useState([]);

  useEffect(() => {
    getAlertTemperatureFromStorage();
    getAlerthumidityFromStorage();
  }, []);

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
    }
  };

  const getAlertTemperatureFromStorage = async () => {
    try {
      const snapshot = await getDocs(collection(storage, "alert_temperature"));
      const data = snapshot.docs.map((doc) => {
        return { ...doc.data(), time: doc.id };
      });
      setTemperatureList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAlerthumidityFromStorage = async () => {
    try {
      const snapshot = await getDocs(collection(storage, "alert_humidity"));
      const data = snapshot.docs.map((doc) => {
        console.log({ ...doc.data(), time: doc.id });
        return { ...doc.data(), time: doc.id };
      });
      setHumidityList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const hanlderOnCloseAlert = (item, sensorName) => {
    if (sensorName == "temperature") {
      deleteDoc(doc(storage, "alert_temperature", item?.time));
      getAlertTemperatureFromStorage();
    } else if (sensorName == "humidity") {
      deleteDoc(doc(storage, "alert_humidity", item?.time));
      getAlerthumidityFromStorage();
    }
  };

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-5">
        <div className="">Temperature</div>
        <div className="w-full h-full">
          <List>
            <VirtualList
              data={temperatureList.sort((a, b) => b.time - a.time)}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="time"
              onScroll={onScroll}
            >
              {(item) => (
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  className="mb-5"
                >
                  {item?.type == "upper" ? (
                    <AlertAntd
                      message="Temperature is too high"
                      banner={false}
                      description={`It is ${item?.value} °C, at ${formatTime(
                        item?.time * 1000
                      )}
                      `}
                      type="warning"
                      showIcon
                      closable
                      onClose={() => {
                        hanlderOnCloseAlert(item, "temperature");
                      }}
                    />
                  ) : (
                    <AlertAntd
                      message="Temperature is too low"
                      banner={false}
                      description={`It is ${item?.value} °C, at ${formatTime(
                        item?.time * 1000
                      )}
                      `}
                      type="error"
                      showIcon
                      closable
                      onClose={() => {
                        hanlderOnCloseAlert(item, "temperature");
                      }}
                    />
                  )}
                </Space>
              )}
            </VirtualList>
          </List>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-5">
        <div className="">Humidity</div>
        <div className="w-full h-full">
          <List>
            <VirtualList
              data={humidityList.sort((a, b) => b.time - a.time)}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="time"
              onScroll={onScroll}
            >
              {(item) => (
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  className="mb-5"
                >
                  {item?.type == "upper" ? (
                    <AlertAntd
                      message="Humidity is too high"
                      banner={false}
                      description={`It is ${item?.value} %, at ${formatTime(
                        item?.time * 1000
                      )}
                      `}
                      type="warning"
                      showIcon
                      closable
                      onClose={() => {
                        hanlderOnCloseAlert(item, "humidity");
                      }}
                    />
                  ) : (
                    <AlertAntd
                      message="Humidity is too low"
                      banner={false}
                      description={`It is ${item?.value} %, at ${formatTime(
                        item?.time * 1000
                      )}
                      `}
                      type="error"
                      showIcon
                      closable
                      onClose={() => {
                        hanlderOnCloseAlert(item, "humidity");
                      }}
                    />
                  )}
                </Space>
              )}
            </VirtualList>
          </List>
        </div>
      </div>
    </div>
  );
};

export default Alert;
