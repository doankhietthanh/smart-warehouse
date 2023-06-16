import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal } from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Checkbox from "antd/es/checkbox/Checkbox";
import {
  storage,
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteField,
  deleteDoc,
} from "../../../services/firebase";
import { notification } from "antd";
import EditVehicle from "./EditVehicle";

const { confirm } = Modal;

const VehicleList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [vehicleSelected, setVehicelSelected] = useState({});
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        const vehiclesRef = collection(storage, "vehicles");
        const vehiclesSnapshot = await getDocs(vehiclesRef);
        const vehiclesList = vehiclesSnapshot.docs.map((doc) => {
          const internationalValue = doc.data().international;
          return {
            ...doc.data(),
            internationalCheckbox: (
              <Checkbox checked={internationalValue} disabled={true} />
            ),
            key: doc.id,
          };
        });
        setVehicles(vehiclesList);
      } catch (e) {
        console.log(e);
      }
    };
    getVehicles();
  }, [vehicles]);

  const showModal = (record) => {
    // console.log(record);
    setOpenModal(true);
    setVehicelSelected(record);
  };

  const hanlderCancleModal = () => {
    setOpenModal(false);
  };

  const hanlderOKModal = () => {
    setOpenModal(false);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure delete this vehicle?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteVehicle(record.vehicleNumber);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteVehicle = async (vehicleNumber) => {
    console.log(vehicleNumber);
    try {
      await deleteDoc(doc(storage, "vehicles", vehicleNumber)).then(() => {
        notification.success({
          message: "Success",
          description: `Vehicle ${vehicleNumber} deleted`,
          duration: 3,
        });
      }).catch((error) => {
        notification.error({
          message: "Error",
          description: `Vehicle ${vehicleNumber} deleted failed`,
          duration: 3,
        });
      });
       
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Error",
        description: `Vehicle ${vehicleNumber} deleted failed`,
        duration: 3,
      });
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      width: "20%",
      ...getColumnSearchProps("vehicleNumber"),
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      width: "20%",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "International",
      dataIndex: "internationalCheckbox",
      key: "internationalCheckbox",
      width: "10%",
      sorter: (a, b) =>
        a.internationalCheckbox.props.checked - b.internationalCheckbox.props.checked,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_, record) => (
         <Space size="middle">
          <EditOutlined style={{"color": "green"}} onClick={() => {showModal(record)}}/>
          <DeleteOutlined style={{"color": "red"}} onClick={() => {showDeleteConfirm(record)}} />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Modal
        title="Update Vehicle"
        open={openModal}
        onOk={hanlderOKModal}
        onCancel={hanlderCancleModal}
        footer={[]}
      >
        <EditVehicle vehicle={vehicleSelected}/>
      </Modal>

      <div className="w-full h-auto">
        <Button type="primary">
          <Link to="/vehicle">Register Vehicle</Link>
        </Button>
      </div>
      <div className="flex-1 w-full h-full mt-5">
        <Table columns={columns} dataSource={vehicles} />
      </div>
    </div>
  );
};

export default VehicleList;
