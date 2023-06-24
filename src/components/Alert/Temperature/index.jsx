import React, { useState, useEffect } from "react";
import { Alert as AlertAntd, Space, List, Skeleton } from "antd";
import VirtualList from "rc-virtual-list";
import {
  storage,
  deleteDoc,
  doc,
  getDocs,
  collection,
} from "../../../services/firebase";
import { formatTime } from "../../../utils/constant";

const calculateContainerHeight = () => {
  const vh = window.innerHeight * 0.01;
  return vh * 100 - 20;
};

const TemperatureAlert = () => {
  const ContainerHeight = calculateContainerHeight();
  const [loading, setLoading] = useState(true);
  const [temperatureList, setTemperatureList] = useState([]);

  useEffect(() => {
    getAlertTemperatureFromStorage();
  }, []);

  const getAlertTemperatureFromStorage = async () => {
    try {
      const snapshot = await getDocs(collection(storage, "alert_temperature"));
      const data = snapshot.docs.map((doc) => {
        return { ...doc.data(), time: doc.id };
      });
      setTemperatureList(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const hanlderOnCloseAlert = (item) => {
    deleteDoc(doc(storage, "alert_temperature", item?.time));
    getAlertTemperatureFromStorage();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-5">
      <div className="">Temperature</div>
      <div className="w-full h-full">
        {loading ? (
          <Skeleton active />
        ) : (
          <List>
            <VirtualList
              data={temperatureList.sort((a, b) => b.time - a.time)}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="time"
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
                        hanlderOnCloseAlert(item);
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
                        hanlderOnCloseAlert(item);
                      }}
                    />
                  )}
                </Space>
              )}
            </VirtualList>
          </List>
        )}
      </div>
    </div>
  );
};

export default TemperatureAlert;
