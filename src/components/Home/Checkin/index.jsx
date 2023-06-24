import React, { useState, useEffect, useRef } from "react";
import {
  ACTION_DB,
  UNCHECKED_QR,
  COLUMS_TABLE_AT_HOME,
  formatTime,
} from "../../../utils/constant";
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
} from "../../../services/firebase";
import jsQR from "jsqr";
import { Image as ImageAntd } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Table, notification, Spin, Skeleton } from "antd";
const Checkin = (props) => {
  const [loading, setLoading] = useState(true);
  const [readerQrCheckin, setReaderQrCheckin] = useState(null);
  const [imgCheckin, setImgCheckin] = useState(null);
  const [verified, setVerified] = useState(false);
  const [vehicleVerified, setVehicleVerified] = useState({});
  const [timeVehicleCheckin, setTimeVehicleCheckin] = useState(null);
  const [dataVehicleCheckin, setDataVehicleCheckin] = useState([]);

  const [gateEmpty, setGateEmpty] = useState([]);
  const [totalGate, setTotalGate] = useState(3);

  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    onValue(ref(database, "gate/totalGate"), (snapshot) => {
      setTotalGate(snapshot.val());
    });
  }, []);

  useEffect(() => {
    getImageCheckinFromDB();
    getGateUsedFromStorage();

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
  }, [imgCheckin, readerQrCheckin, props.vehicleList]);

  useEffect(() => {
    verifyVehicle(readerQrCheckin);
  }, [readerQrCheckin]);

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
        value: vehicleVerified?.gate,
      },
    ]);
  }, [vehicleVerified, timeVehicleCheckin]);

  const getImageCheckinFromDB = () => {
    onValue(ref(database, "checkin/camera/"), (snapshot) => {
      let data = snapshot.val();

      const header = "data:image/png;base64,";
      data = header + data;

      setImgCheckin(data);
    });
  };

  const verifyVehicle = async (readerQr) => {
    const vehicle = props.vehicleList.find(
      (vehicle) => vehicle.vehicleNumber === readerQr
    );

    const gateRef = collection(storage, "gates");
    const gateSnapshot = await getDocs(gateRef);
    const gateList = gateSnapshot.docs.map((doc) => {
      return doc.data();
    });

    const gateListCheckAgain = gateList.find(
      (gate) => gate?.vehicleNumber === vehicle?.vehicleNumber
    );

    if (vehicle) {
      setLoading(false);

      if (gateListCheckAgain) {
        setVehicleVerified(vehicle);
        setVerified(false);
        setMessageError("Vehicle has been checked in");
        return;
      }

      setVerified(true);
      setVehicleVerified({ ...vehicle, gate: gateEmpty[0]?.toString() });

      const date = new Date();
      const time = Math.floor(date.getTime() / 1000);
      set(ref(database, "checkin/time/"), time);
      set(ref(database, "checkin/gate/"), Number(gateEmpty[0]));
      set(ref(database, "action"), ACTION_DB.OPEN_GATE);

      const dataStorage = {
        ...vehicle,
        time: time,
        gate: gateEmpty[0].toString(), //get first gate empty
        type: "checkin",
      };

      setDoc(doc(storage, "history", time.toString()), dataStorage);
      setDoc(doc(storage, "gates", gateEmpty[0]?.toString()), dataStorage);
      setDoc(doc(storage, "vehicles", vehicle?.vehicleNumber), dataStorage);
      setTimeVehicleCheckin(formatTime(date.getTime()));
    } else {
      setVerified(false);
      set(ref(database, "checkin/gate/"), Number(UNCHECKED_QR));
      setMessageError("Vehicle not found");
    }
  };

  const getGateUsedFromStorage = async () => {
    try {
      const gateRef = collection(storage, "gates");
      const gateSnapshot = await getDocs(gateRef);
      const gateList = gateSnapshot.docs.map((doc) => {
        return doc.id;
      });
      findGateEmpty(gateList);
    } catch (e) {
      notification.error({
        message: "Error",
        description: `Firebase: ${e.message}`,
      });
    }
  };

  const findGateEmpty = async (gates) => {
    let gateEmpty = [];

    if (gates.length === 0) {
      for (let i = 1; i <= totalGate; i++) {
        gateEmpty.push(i.toString());
      }
    } else {
      for (let i = 1; i <= totalGate; i++) {
        if (!gates.includes(i.toString())) {
          gateEmpty.push(i.toString());
        }
      }
    }

    if (gateEmpty.length === 0) {
      setMessageError("Gate is full");
      set(ref(database, "checkin/gate/"), Number(UNCHECKED_QR));
      set(ref(database, "gate/gateIsFull"), Number(1));
    } else {
      set(ref(database, "gate/gateIsFull"), Number(0));
    }
    setGateEmpty(gateEmpty);
  };

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

  return (
    <div className="flex flex-col w-[50%] h-full justify-start items-center gap-10">
      <div className="flex-1 flex flex-col items-center gap-5">
        <div className=" font-bold text-2xl">Check in</div>
        <div className="w-[360px] h-[360px] flex justify-center items-center">
          {imgCheckin?.split("data:image/png;base64,")[1] == "" ? (
            <div className="w-[360px] h-[280px] border-2 rounded-xl flex justify-center items-center">
              <p>No image detected</p>
            </div>
          ) : (
            <ImageAntd
              src={imgCheckin}
              id="reader"
              width={360}
              height={280}
              className=" border-2 border-red-400 rounded-xl max-h-[360px]"
            />
          )}
        </div>
        <div>
          <span>Vehicle number: </span>
          <span className="text-2xl font-bold">{readerQrCheckin}</span>
        </div>
      </div>

      <div className="flex-1 flex justify-start items-center flex-col gap-10">
        {verified ? (
          <div className="text-center flex gap-2">
            <CheckCircleFilled style={{ fontSize: "24px", color: "#4ABF78" }} />
            <span className="text-xl">Vehicle is verified successfully</span>
          </div>
        ) : (
          <div className="text-center flex gap-2">
            <CloseCircleFilled style={{ fontSize: "24px", color: "#ff7875" }} />
            <span className="text-xl">{messageError}</span>
          </div>
        )}
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            columns={COLUMS_TABLE_AT_HOME}
            dataSource={dataVehicleCheckin}
            pagination={{
              position: ["none", "none"],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Checkin;
