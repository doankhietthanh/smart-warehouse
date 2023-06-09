import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";

import QRCode from "react-qr-code";

const Vehicle = () => {
  const [qrcode, setQrcode] = useState("");

  useEffect(() => {
    setQrcode(qrcode);
  }, [qrcode]);

  const onFinish = (values) => {
    console.log("Success:", values);
    setQrcode(values.vehicleNumber);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white bg-opacity-80 w-[400px] h-auto rounded-xl flex flex-col items-center p-5 gap-10">
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
            <Input placeholder="Vehicle number" />
          </Form.Item>

          <Form.Item
            name="international"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>International</Checkbox>
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
            <QRCode
              size={256}
              style={{ height: "200px", maxWidth: "100%", width: "100%" }}
              value={qrcode}
              viewBox={`0 0 100 100`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Vehicle;
