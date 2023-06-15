import React, { useState, useEffect } from "react";
import jsQR from "jsqr";
import { Image as ImageAntd } from "antd";
import { database, ref, onValue } from "../../services/firebase";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";

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
const data = [
  {
    key: "Time",
    value: "10:00 AM",
  },
  {
    key: "Vehicle Number",
    value: "MH 12 1234",
  },
  {
    key: "User",
    value: "Rahul",
  },
  {
    key: "Email",
    value: "admin@gmail.com",
  },
  {
    key: "Position",
    value: "01",
  },
];

const Welcome = () => {
  const [readerQrCheckin, setReaderQrCheckin] = useState(null);
  const [readerQrCheckout, setReaderQrCheckout] = useState(null);

  const [imgCheckin, setImgCheckin] = useState(null);
  const [imgCheckout, setImgCheckout] = useState(null);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    getImageCheckinFromDB();

    const loadImageCheckin = async () => {
      try {
        const result = await readQRFromImage(imgCheckin);
        setReaderQrCheckin(result);
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
      } catch (error) {
        console.error(error);
      }
    };

    loadImageCheckout();
  }, [imgCheckout]);

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
      const data = snapshot.val();
      setImgCheckin(data);
    });
  };

  const getImageCheckoutFromDB = () => {
    onValue(ref(database, "checkout/camera/"), (snapshot) => {
      const data = snapshot.val();
      setImgCheckout(data);
    });
  };

  // const base64Image =
  //   "data:image/png;base64,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";

  return (
    <div className="w-full h-full flex flex-row gap-5 justify-center items-center">
      <div className="flex flex-col w-[50%] h-full justify-start items-center gap-10">
        <div className="flex-1 flex flex-col justify-center items-center gap-5">
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
              dataSource={data}
              pagination={{
                position: ["none", "none"],
              }}
            />
          </div>
        ) : (
          <div className="text-center flex gap-2">
            <CloseCircleFilled style={{ fontSize: "24px", color: "#ff7875" }} />
            <span className="text-xl">Vehicle is not register</span>
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
            dataSource={data}
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
