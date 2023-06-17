import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, QRCode } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { storage, doc, setDoc } from "../../services/firebase";
import { notification } from "antd";

const Vehicle = () => {
  const [qrcode, setQrcode] = useState("");
  const [isInternational, setIsInternational] = useState(false);

  useEffect(() => {
    setQrcode(qrcode);
  }, [qrcode]);

  const onFinish = (values) => {
    console.log("Success:", values);
    const vehicleNumber = isInternational ? `INA${values.vehicleNumber}` : `VN${values.vehicleNumber}`;
    updateVehicleToStorage({
      ...values,
      vehicleNumber: vehicleNumber,
    });
    setQrcode(vehicleNumber);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const updateVehicleToStorage = (vehicle) => {
    try {
      setDoc(doc(storage, "vehicles", vehicle.vehicleNumber), vehicle)
        .then(() => {
          console.log("Document successfully written!");
          notification.success({
            message: "Success",
            description: `Vehicle ${vehicle.vehicleNumber} created`,
            duration: 3,
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          notification.error({
            message: "Error",
            description: `Vehicle ${vehicle.vehicleNumber} created failed`,
            duration: 3,
          });
        });
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Error",
        description: `Vehicle ${vehicle.vehicleNumber} created failed`,
        duration: 3,
      });
    }
  };

  const downloadQRCode = () => {
    const canvas = document
      .getElementById("vehicle-qrcode")
      ?.querySelector("canvas");

    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");

      a.download = `${qrcode?.toUpperCase() ?? "QRCode"}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white bg-opacity-80 w-[400px] h-auto rounded-xl flex flex-col items-center p-5 gap-5">
        <h2 className="text-2xl font-medium">Register vehicle</h2>
        <Form
          className="flex flex-col gap-2 w-full"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
         <Form.Item
            name="international"
            valuePropName="checked"
            initialValue={false}
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox onChange={(e) => {
              setIsInternational(e.target.checked)
            }}>International</Checkbox>
          </Form.Item>

          <Form.Item
            label="Number"
            name="vehicleNumber"
            placeholder="Vehicle number"
            rules={[
              {
                required: true,
                message: "Please input your vehicle number!",
              },
            ]}
          >
            <Input  addonBefore={isInternational ? "INA" : "VN"} placeholder="Vehicle number" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>

         

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        {qrcode ? (
          <div className="w-full h-full p-5 flex justify-center items-center">
            <div
              id="vehicle-qrcode"
              className="flex justify-center items-center gap-2"
            >
              <QRCode value={qrcode} style={{ marginBottom: 16 }} />
            </div>
            <Button type="text" onClick={downloadQRCode}>
              <DownloadOutlined style={{ fontSize: "24px" }} />
            </Button>
          </div>
        ) : (
          <QRCode value="" status="loading" />
        )}
      </div>
    </div>
  );
};

export default Vehicle;
