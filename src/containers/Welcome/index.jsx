import React, { useState, useEffect } from "react";
import jsQR from "jsqr";
import { Image as ImageAntd } from "antd";
import {
  database,
  ref,
  set,
  onValue,
  storage,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  collection,
} from "../../services/firebase";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Space, Table, Tag, notification, message } from "antd";

const ACTION_DB = {
  OPEN_GATE: 3,
  CLOSE_GATE: 4,
};

const columns = [
  {
    title: "Key",
    dataIndex: "key",
    rowScope: "row",
  },
  {
    title: "Value",
    dataIndex: "value",
  },
];

const Welcome = () => {
  const [readerQrCheckin, setReaderQrCheckin] = useState(null);
  const [readerQrCheckout, setReaderQrCheckout] = useState(null);

  const [imgCheckin, setImgCheckin] = useState(null);
  const [imgCheckout, setImgCheckout] = useState(null);
  const [verified, setVerified] = useState(true);
  const [vehicleList, setVehicleList] = useState([]);

  const [vehicleVerified, setVehicleVerified] = useState({});
  const [timeVehicleCheckin, setTimeVehicleCheckin] = useState(null);
  const [dataVehicleCheckin, setDataVehicleCheckin] = useState([]);

  const [vehicleCheckout, setVehicleCheckout] = useState({});
  const [timeVehicleCheckout, setTimeVehicleCheckout] = useState(null);
  const [dataVehicleCheckout, setDataVehicleCheckout] = useState([]);

  const [gateEmpty, setGateEmpty] = useState([]);
  const [gateUsed, setGateUsed] = useState([]);
  const [totalGate, setTotalGate] = useState(10);

  useEffect(() => {
    getImageCheckinFromDB();

    const loadImageCheckin = async () => {
      try {
        const result = await readQRFromImage(imgCheckin);
        setReaderQrCheckin(result);
        verifyVehicle(result);
      } catch (error) {
        console.error(error);
      }
    };

    loadImageCheckin();
  }, [imgCheckin]);

  useEffect(() => {
    getImageCheckoutFromDB();

    const loadImageCheckout = async () => {
      try {
        const result = await readQRFromImage(imgCheckout);
        setReaderQrCheckout(result);

        const date = new Date();
        const time = Math.floor(date.getTime() / 1000);
        setTimeVehicleCheckout(formatTime(date));

        const vehicle = vehicleList.find(
          (vehicle) => vehicle.vehicleNumber === result
        );
        if (vehicle) {
          setVehicleCheckout(vehicle);
          set(ref(database, "checkout/gate/"), vehicle?.gate);
          set(ref(database, "action"), ACTION_DB.CLOSE_GATE);
          setDoc(doc(storage, "history", time.toString()), {
            ...vehicle,
            time: time,
            type: "checkout",
          }).then(() => {
            console.log("Document successfully written!");
          });
          deleteDoc(doc(storage, "gates", vehicle?.gate));
        } else {
          console.log("Vehicle not found");
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadImageCheckout();
  }, [imgCheckout]);

  useEffect(() => {
    getVehicleListFromStorage();
    onValue(ref(database, "totalGate"), (snapshot) => {
      setTotalGate(snapshot.val());
    });
  }, []);

  useEffect(() => {
    getGateUsedFromStorage();
  }, [imgCheckin]);

  useEffect(() => {
    verifyVehicle(readerQrCheckin);
  }, [vehicleList, readerQrCheckin]);

  useEffect(() => {
    setDataVehicleCheckin([
      {
        key: "Time",
        value: timeVehicleCheckin,
      },
      {
        key: "Vehicle Number",
        value: vehicleVerified?.vehicleNumber,
      },
      {
        key: "User",
        value: vehicleVerified?.username,
      },
      {
        key: "Email",
        value: vehicleVerified?.email,
      },
      {
        key: "Gate",
        value: gateEmpty[0]?.toString() ?? "No gate available",
      },
    ]);
  }, [vehicleVerified, timeVehicleCheckin]);

  useEffect(() => {
    setDataVehicleCheckout([
      {
        key: "Time",
        value: timeVehicleCheckout,
      },
      {
        key: "Vehicle Number",
        value: vehicleCheckout?.vehicleNumber,
      },
      {
        key: "User",
        value: vehicleCheckout?.username,
      },
      {
        key: "Email",
        value: vehicleCheckout?.email,
      },
      {
        key: "Gate",
        value: vehicleCheckout?.gate,
      },
    ]);
  }, [vehicleCheckout, timeVehicleCheckout, imgCheckout]);

  const readQRFromImage = async (base64Image) => {
    return new Promise((resolve, reject) => {
      // Create a new Image object
      const image = new Image();
      image.src = base64Image;

      // Wait for the image to load
      image.onload = async () => {
        try {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          // Set the canvas size to the image size
          canvas.width = image.width;
          canvas.height = image.height;

          // Draw the image on the canvas
          context.drawImage(image, 0, 0);

          // Get the image data from the canvas
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Decode the QR code from the image data
          const code = await jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );

          // Handle the decoded QR code
          if (code) {
            console.log("QR code:", code.data);
            resolve(code.data);
          } else {
            console.log("No QR code found");
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      };

      // Handle image load error
      image.onerror = (error) => {
        reject(error);
      };
    });
  };

  const getImageCheckinFromDB = () => {
    onValue(ref(database, "checkin/camera/"), (snapshot) => {
      let data = snapshot.val();

      const header = "data:image/png;base64,";
      data = header + data;

      setImgCheckin(data);
    });
  };

  const getImageCheckoutFromDB = () => {
    onValue(ref(database, "checkout/camera/"), (snapshot) => {
      let data = snapshot.val();
      const header = "data:image/png;base64,";
      data = header + data;
      setImgCheckout(data);
    });
  };

  const verifyVehicle = (readerQr) => {
    const vehicle = vehicleList.find(
      (vehicle) => vehicle.vehicleNumber === readerQr
    );

    if (gateEmpty.length === 0) {
      setVerified(false);
      return;
    }

    if (vehicle) {
      setVerified(true);
      setVehicleVerified(vehicle);
      const date = new Date();
      const time = Math.floor(date.getTime() / 1000);
      set(ref(database, "checkin/time/"), time);

      set(ref(database, "checkin/gate/"), gateEmpty[0]);
      set(ref(database, "action"), ACTION_DB.OPEN_GATE);

      const dataStorage = {
        ...vehicle,
        time: time,
        gate: gateEmpty[0].toString(), //get first gate empty
        type: "checkin",
      };
      setDoc(doc(storage, "history", time.toString()), dataStorage);

      console.log(gateEmpty[0]);
      setDoc(doc(storage, "gates", gateEmpty[0].toString()), dataStorage);
      setDoc(doc(storage, "vehicles", vehicle.vehicleNumber), dataStorage);

      setTimeVehicleCheckin(formatTime(date.getTime()));
    } else {
      setVerified(false);
    }
  };

  const getVehicleListFromStorage = async () => {
    try {
      const vehiclesRef = collection(storage, "vehicles");
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehiclesList = vehiclesSnapshot.docs.map((doc) => {
        console.log(doc.data());
        return doc.data();
      });
      setVehicleList(vehiclesList);
    } catch (e) {
      notification.error({
        message: "Error",
        description: `Firebase: ${e.message} Your project has exceeded no-cost limits. Please upgrade to ensure there is no service disruption.
        `,
      });
    }
  };

  const getGateUsedFromStorage = async () => {
    try {
      const gateRef = collection(storage, "gates");
      const gateSnapshot = await getDocs(gateRef);
      const gateList = gateSnapshot.docs.map((doc) => {
        return doc.id;
      });
      console.log(gateList);
      findGateEmpty(gateList);
    } catch (e) {
      notification.error({
        message: "Error",
        description: `Firebase: ${e.message}`,
      });
    }
  };

  const findGateEmpty = async (gates) => {
    //gateUsed = [1,2];
    //totalGate = 3;
    // return gateEmpty = [3]

    const gateEmpty = [];
    for (let i = 1; i <= totalGate; i++) {
      if (!gates.includes(i.toString())) {
        gateEmpty.push(i.toString());
      }
    }

    if (gateEmpty.length === 0) {
      message.error("Gate is full");
    }
    setGateEmpty(gateEmpty);
  };

  const formatTime = (time) => {
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

    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${day} ${month} ${year} - ${hour}:${minute}:${second}`;
  };

  return (
    <div className="w-full h-full flex flex-row gap-5 justify-center items-center">
      <div className="flex flex-col w-[50%] h-full justify-start items-center gap-10">
        <div className="flex-1 flex flex-col items-center gap-5">
          <div className=" font-bold text-2xl">Check in</div>
          <ImageAntd src={imgCheckin} width={500} height={500} />
          <div>
            <span>Vehicle number: </span>
            <span className="text-2xl font-bold">{readerQrCheckin}</span>
          </div>
        </div>

        {verified ? (
          <div className="flex-1 flex justify-start items-center flex-col gap-10">
            <div className="text-center flex gap-2">
              <CheckCircleFilled
                style={{ fontSize: "24px", color: "#4ABF78" }}
              />
              <span className="text-xl">Vehicle has been checked in</span>
            </div>
            <Table
              columns={columns}
              dataSource={dataVehicleCheckin}
              pagination={{
                position: ["none", "none"],
              }}
            />
          </div>
        ) : (
          <div className="text-center flex gap-2">
            <CloseCircleFilled style={{ fontSize: "24px", color: "#ff7875" }} />
            <span className="text-xl">Vehicle is not verifed</span>
          </div>
        )}
      </div>
      <div className="flex flex-col w-[50%] h-full justify-start items-center gap-10">
        <div className="flex-1 flex flex-col justify-center items-center gap-5">
          <div className=" font-bold text-2xl">Check out</div>
          <ImageAntd src={imgCheckout} width={500} height={500} />
          <div>
            <span>Vehicle number: </span>
            <span className="text-2xl font-bold">{readerQrCheckout}</span>
          </div>
        </div>

        <div className="flex-1 flex justify-start items-center flex-col gap-10">
          <div className="text-center flex gap-2 w-full h-[28px]"></div>
          <Table
            columns={columns}
            dataSource={dataVehicleCheckout}
            pagination={{
              position: ["none", "none"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
