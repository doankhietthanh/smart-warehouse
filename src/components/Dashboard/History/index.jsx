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
  Skeleton,
  Spin,
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
import Vehicle from "./../../../containers/Vehicle/index";

const { Search } = Input;

const calculateContainerHeight = () => {
  const vh = window.innerHeight * 0.01;
  return vh * 100;
};
const ContainerHeight = calculateContainerHeight();

const History = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicleListBackup, setVehicleListBackup] = useState([]);
  const [searchTypes, setSearchTypes] = useState({
    vehicleNumber: "",
    gate: "",
    vietnam: false,
    international: false,
    checkin: false,
    checkout: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVehicleListFromStorage();
  }, []);

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
      setLoading(false);
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

  const onSearchVehicle = () => {
    setVehicleList(vehicleListBackup);

    if (
      !searchTypes.vehicleNumber &&
      !searchTypes.gate &&
      !searchTypes.vietnam &&
      !searchTypes.international &&
      !searchTypes.checkin &&
      !searchTypes.checkout
    )
      return;

    let vehicles = vehicleListBackup;

    if (searchTypes.vehicleNumber) {
      vehicles = vehicles.filter(
        (vehicle) => vehicle?.vehicleNumber === searchTypes.vehicleNumber
      );
    }

    if (searchTypes.gate) {
      vehicles = vehicles.filter(
        (vehicle) => vehicle?.gate == searchTypes.gate
      );
    }

    if (!searchTypes.vietnam || !searchTypes.international) {
      if (searchTypes.vietnam) {
        vehicles = vehicles.filter(
          (vehicle) => vehicle?.international == false
        );
      }

      if (searchTypes.international) {
        vehicles = vehicles.filter((vehicle) => vehicle?.international == true);
      }
    }

    if (!searchTypes.checkin || !searchTypes.checkout) {
      if (searchTypes.checkin) {
        vehicles = vehicles.filter((vehicle) => vehicle?.type == "checkin");
      }

      if (searchTypes.checkout) {
        vehicles = vehicles.filter((vehicle) => vehicle?.type == "checkout");
      }
    }

    if (vehicles) {
      setVehicleList(vehicles);
    } else {
      setVehicleList([]);
    }
  };

  useEffect(() => {
    onSearchVehicle();
  }, [searchTypes]);

  const randomColor = () => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex-1 h-full w-full flex justify-center items-center">
        {loading ? (
          <Spin size="large" />
        ) : (
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
        )}
      </div>
      <div className="w-[250px] text-green-500 pl-5">
        <Form>
          <Form.Item>
            <Search
              placeholder="Search by vehicle number"
              className="rounded-xl"
              allowClear
              onSearch={(value) => {
                setSearchTypes({
                  ...searchTypes,
                  vehicleNumber: value,
                });
              }}
            />
          </Form.Item>
        </Form>
        <Form>
          <Form.Item>
            <Select
              placeholder="Select a gate"
              className="rounded-xl"
              allowClear
              onChange={(value) => {
                setSearchTypes({
                  ...searchTypes,
                  gate: value,
                });
              }}
            >
              <Select.Option value="1">Gate 1</Select.Option>
              <Select.Option value="2">Gate 2</Select.Option>
              <Select.Option value="3">Gate 3</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <Form>
          <div className="flex flex-col gap-2">
            <label>Location</label>
            <div className="flex">
              <Form.Item>
                <Checkbox
                  onChange={(e) => {
                    setSearchTypes({
                      ...searchTypes,
                      vietnam: e.target.checked,
                    });
                  }}
                >
                  Vietnam
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox
                  onChange={(e) => {
                    setSearchTypes({
                      ...searchTypes,
                      international: e.target.checked,
                    });
                  }}
                >
                  International
                </Checkbox>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Form>
          <div className="flex flex-col gap-2">
            <label>Status</label>
            <div className="flex">
              <Form.Item>
                <Checkbox
                  onChange={(e) => {
                    setSearchTypes({
                      ...searchTypes,
                      checkin: e.target.checked,
                    });
                  }}
                >
                  Checkin
                </Checkbox>
              </Form.Item>
              <Form.Item
                onChange={(e) => {
                  setSearchTypes({
                    ...searchTypes,
                    checkout: e.target.checked,
                  });
                }}
              >
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
