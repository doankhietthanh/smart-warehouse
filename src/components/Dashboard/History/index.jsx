import React, { useState, useEffect } from "react";
import VirtualList from "rc-virtual-list";
import {
  Avatar,
  List,
  message,
  notification,
  Form,
  Checkbox,
  Input,
  Select,
} from "antd";
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
} from "../../../services/firebase";
import { formatTime } from "../../../utils/constant";

const { Search } = Input;

const calculateContainerHeight = () => {
  const vh = window.innerHeight * 0.01;
  return vh * 100;
};
const ContainerHeight = calculateContainerHeight();

const History = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicleListBackup, setVehicleListBackup] = useState([]);

  useEffect(() => {
    getVehicleListFromStorage();
  }, []);

  useEffect(() => {
    console.log(vehicleList);
  }, [vehicleList]);

  const getVehicleListFromStorage = async () => {
    try {
      const vehiclesRef = collection(storage, "history");
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehiclesList = vehiclesSnapshot.docs.map((doc) => {
        return doc.data();
      });
      vehiclesList.sort((a, b) => b?.time - a?.time);
      setVehicleList(vehiclesList);
      setVehicleListBackup(vehiclesList);
    } catch (e) {
      notification.error({
        message: "Error",
        description: `Firebase: ${e.message} Your project has exceeded no-cost limits. Please upgrade to ensure there is no service disruption.
        `,
      });
    }
  };

  const onScroll = (e) => {
    e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight;
  };

  const onSearchByVehicleNumber = (value) => {
    setVehicleList(vehicleListBackup);

    if (!value) return;

    const vehicles = vehicleListBackup.filter(
      (vehicle) => vehicle?.vehicleNumber === value
    );
    console.log(vehicles);
    if (vehicles) {
      setVehicleList(vehicles);
    } else {
      setVehicleList([]);
    }
  };

  const onSearchByGate = (value) => {
    setVehicleList(vehicleListBackup);

    if (!value) return;

    const vehicles = vehicleListBackup.filter(
      (vehicle) => vehicle?.gate == value
    );
    console.log(vehicles);

    if (vehicles) {
      setVehicleList(vehicles);
    } else {
      setVehicleList([]);
    }
  };

  // const onSearchByLocation = (value) => {
  //   const vehicle = vehicleList.find(
  //     (vehicle) => vehicle.location === value
  //   );
  //   if (vehicle) {
  //     setVehicleList([vehicle]);

  const randomColor = () => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex-1 h-full w-full flex justify-center items-center">
        <List className="w-full h-full">
          <VirtualList
            data={vehicleList}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="time"
            onScroll={onScroll}
          >
            {(item) => (
              <List.Item
                className={`${
                  item?.type === "checkin" ? "bg-gray-200" : "bg-red-200"
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
                        <EnvironmentOutlined /> Gate {item?.gate}
                      </div>
                    </div>
                  }
                />
                <div className="mr-5">{formatTime(item?.time * 1000)}</div>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
      <div className="w-[250px] text-green-500 pl-5">
        <Form onFinish={onSearchByVehicleNumber}>
          <Form.Item>
            <Search
              placeholder="Search by vehicle number"
              className="rounded-xl"
              allowClear
              onSearch={onSearchByVehicleNumber}
            />
          </Form.Item>
        </Form>
        <Form onFinish={onSearchByGate}>
          <Form.Item>
            <Select
              placeholder="Select a gate"
              className="rounded-xl"
              allowClear
              onChange={onSearchByGate}
            >
              <Select.Option value="1">Gate 1</Select.Option>
              <Select.Option value="2">Gate 2</Select.Option>
              <Select.Option value="3">Gate 3</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <Form onFinish={() => {}}>
          <div className="flex flex-col gap-2">
            <label>Location</label>
            <div className="flex">
              <Form.Item>
                <Checkbox>Vietnam</Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox>International</Checkbox>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Form>
          <div className="flex flex-col gap-2">
            <label>Status</label>
            <div className="flex">
              <Form.Item>
                <Checkbox>Checkin</Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox>Checkout</Checkbox>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default History;