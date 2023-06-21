import React, { useState, useEffect } from "react";
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
import { Space, Table, Tag, notification, message } from "antd";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from "html5-qrcode";

const Checkout = (props) => {
  const [readerQrCheckout, setReaderQrCheckout] = useState(null);
  const [imgCheckout, setImgCheckout] = useState(null);
  const [verified, setVerified] = useState(false);
  const [vehicleVerified, setVehicleVerified] = useState({});
  const [timeVehicleCheckout, setTimeVehicleCheckout] = useState(null);
  const [dataVehicleCheckout, setDataVehicleCheckout] = useState([]);

  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    getImageCheckoutFromDB();

    const loadImageCheckout = async () => {
      try {
        // if (!imgCheckout) return;
        // const base64String = imgCheckout
        //   .replace("data:", "")
        //   .replace(/^.+,/, "")
        //   .replace(/%2F/g, "/")
        //   .replace(/%2B/g, "+");
        // const imageFile = createFileFromBase64(
        //   base64String,
        //   "checkout.png",
        //   "image/png"
        // );
        // const qrcode = new Html5Qrcode("reader-checkout", {
        //   qrbox: { width: 250, height: 250 },
        //   formatsToSupport: [
        //     Html5QrcodeSupportedFormats.QR_CODE,
        //     Html5QrcodeSupportedFormats.UPC_A,
        //     Html5QrcodeSupportedFormats.UPC_E,
        //     Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
        //   ],
        //   scansupportedScanTypesType: [Html5QrcodeScanType.SCAN_TYPE_FILE],
        // });
        // qrcode.clear();
        // qrcode
        //   .scanFile(imageFile, true)
        //   .then((result) => {
        //     console.log("QR Code:", result);
        //     setReaderQrCheckout(result);
        //     verifyVehicle(result);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        const result = await readQRFromImage(imgCheckout);
        setReaderQrCheckout(result);
        verifyVehicle(result);
      } catch (error) {
        console.error(error);
      }
    };

    loadImageCheckout();
  }, [imgCheckout, readerQrCheckout, props.vehicleList]);

  useEffect(() => {
    verifyVehicle(readerQrCheckout);
  }, [readerQrCheckout]);

  useEffect(() => {
    setDataVehicleCheckout([
      {
        key: "Time",
        value: timeVehicleCheckout,
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
  }, [vehicleVerified, timeVehicleCheckout]);

  const getImageCheckoutFromDB = () => {
    onValue(ref(database, "checkout/camera/"), (snapshot) => {
      let data = snapshot.val();

      const header = "data:image/png;base64,";
      data = header + data;

      setImgCheckout(data);
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
      if (!gateListCheckAgain) {
        setVehicleVerified(vehicle);
        setVerified(false);
        setMessageError("Vehicle are not checkin");
        return;
      }

      setVerified(true);
      setVehicleVerified(vehicle);
      const date = new Date();
      const time = Math.floor(date.getTime() / 1000);
      set(ref(database, "checkout/time/"), time);
      if (vehicle?.gate)
        set(ref(database, "checkout/gate/"), Number(vehicle?.gate));
      set(ref(database, "action"), ACTION_DB.CLOSE_GATE);

      const dataStorage = {
        ...vehicle,
        time: time,
        type: "checkout",
      };

      setDoc(doc(storage, "history", time.toString()), dataStorage);
      if (vehicle?.gate) deleteDoc(doc(storage, "gates", vehicle?.gate));
      setDoc(doc(storage, "vehicles", vehicle?.vehicleNumber), dataStorage);
      setTimeVehicleCheckout(formatTime(date.getTime()));
    } else {
      setVerified(false);
      set(ref(database, "checkout/gate/"), Number(UNCHECKED_QR));
      setMessageError("Vehicle not found");
    }
  };

  const createFileFromBase64 = (base64String, fileName, fileType) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: fileType });
    return new File([blob], fileName, { type: fileType });
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
        <div className=" font-bold text-2xl">Check out</div>
        <div className="w-[360px] h-[360px] flex justify-center items-center">
          <ImageAntd
            src={imgCheckout}
            id="reader-checkout"
            width={360}
            className=" border-2 border-red-400 rounded-xl"
          />
        </div>
        <div>
          <span>Vehicle number: </span>
          <span className="text-2xl font-bold">{readerQrCheckout}</span>
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
        <Table
          columns={COLUMS_TABLE_AT_HOME}
          dataSource={dataVehicleCheckout}
          pagination={{
            position: ["none", "none"],
          }}
        />
      </div>
    </div>
  );
};

export default Checkout;
