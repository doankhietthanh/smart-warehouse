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

const HumidityAlert = () => {
  const ContainerHeight = calculateContainerHeight();
  const [loading, setLoading] = useState(true);
  const [humidityList, setHumidityList] = useState([]);

  useEffect(() => {
    getAlerthumidityFromStorage();
  }, []);

  const getAlerthumidityFromStorage = async () => {
    try {
      const snapshot = await getDocs(collection(storage, "alert_humidity"));
      const data = snapshot.docs.map((doc) => {
        return { ...doc.data(), time: doc.id };
      });
      setHumidityList(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const hanlderOnCloseAlert = (item) => {
    deleteDoc(doc(storage, "alert_humidity", item?.time));
    getAlerthumidityFromStorage();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-5">
      <div className="">Humidity</div>
      <div className="w-full h-full">
        {loading ? (
          <Skeleton active />
        ) : (
          <List>
            <VirtualList
              data={humidityList.sort((a, b) => b.time - a.time)}
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
                        hanlderOnCloseAlert(item);
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

export default HumidityAlert;
