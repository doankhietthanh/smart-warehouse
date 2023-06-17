import React, { useState, useEffect } from "react";
import VirtualList from "rc-virtual-list";
import { Avatar, List, message, notification } from "antd";
import { EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import {
  database,
  ref,
  set,
  onValue,
  storage,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
} from "../../services/firebase";

const calculateContainerHeight = () => {
  const vh = window.innerHeight * 0.01;
  return vh * 100;
};
const ContainerHeight = calculateContainerHeight();

const Dashboard = () => {
  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
    getVehicleListFromStorage();
  }, []);

  const getVehicleListFromStorage = async () => {
    try {
      const vehiclesRef = collection(storage, "vehicles");
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehiclesList = vehiclesSnapshot.docs.map((doc) => {
        return doc.data();
      });
      //sort by time
      console.log(vehiclesList);
      vehiclesList.sort((a, b) => b?.time - a?.time);
      console.log(vehiclesList);
      setVehicleList(vehiclesList);
    } catch (e) {
      notification.error({
        message: "Error",
        description: `Firebase: ${e.message} Your project has exceeded no-cost limits. Please upgrade to ensure there is no service disruption.
        `,
      });
    }
  };

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };

  const formatTime = (time) => {
    if (!time) return;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(time * 1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${day} ${month} ${year} - ${hour}:${minute}:${second}`;
  };

  const randomColor = () => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[200px] text-green-500">Filter</div>
      <div className="flex-1 h-full w-full flex justify-center items-center">
        <List className="w-full h-full">
          <VirtualList
            data={vehicleList}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="vehicleNumber"
            onScroll={onScroll}
          >
            {(item) => (
              <List.Item
                className={`${
                  item?.type === "checkin" ? "bg-blue-300" : "bg-red-200"
                }
                flex justify-between items-center rounded-xl m-2`}
                key={item?.vehicleNumber}
              >
                <List.Item.Meta
                  className="flex justify-center items-center ml-5"
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: randomColor(),
                      }}
                    >
                      {item?.username[0]}
                    </Avatar>
                  }
                  title={
                    <div>
                      <div className="font-bold text-xl">
                        {item?.vehicleNumber}
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <div>{item?.username}</div>
                      <div>
                        <MailOutlined /> {item?.email}
                      </div>
                      <div className="font-bold">
                        <EnvironmentOutlined /> {item?.gate}
                      </div>
                    </div>
                  }
                />
                <div className="mr-5">{formatTime(item?.time)}</div>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
    </div>
  );
};

export default Dashboard;
