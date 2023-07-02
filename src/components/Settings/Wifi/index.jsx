import React from "react";
import { Button, Form, Input, notification } from "antd";
import { database, ref, set } from "../../../services/firebase";
import { ACTION_DB } from "../../../utils/constant";

const Wifi = () => {
  const onFinish = (values) => {
    if (values.password.length < 8) {
      notification.error({
        message: "Error",
        description: `Password must be at least 8 characters`,
        duration: 3,
      });
      return;
    }
    set(ref(database, "wifi"), values);
    set(ref(database, "action"), ACTION_DB.WIFI_SETUP)
      .then(() => {
        notification.success({
          message: "Success",
          description: `Wifi setup success`,
          duration: 3,
        });
      })
      .catch((e) => {
        notification.error({
          message: "Error",
          description: `Wifi setup failed`,
          duration: 3,
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="w-full h-full flex ">
      <Form
        className="w-[500px] h-auto"
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
        <div className="w-full text-2xl font-boild mb-5 text-center">
          SETUP WIFI
        </div>
        <Form.Item
          label="SSID"
          name="ssid"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
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
    </div>
  );
};

export default Wifi;
