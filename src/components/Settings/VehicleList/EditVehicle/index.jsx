import React, { useState, useEffect  } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { storage, doc, setDoc } from "../../../../services/firebase";
import { notification } from "antd";

const EditVehicle = (props) => {
  const [vehicle, setVehicle] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(props.vehicle);
    setVehicle(props.vehicle);
    form.setFieldsValue(props.vehicle);
  }, [props.vehicle]);

  useEffect(() => {
    console.log(vehicle);
  }, [vehicle]);
  
  const onFinish = (values) => {
    console.log("Success:", values);
    updateVehicleToStorage(values);
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
            description: `Vehicle ${vehicle.vehicleNumber} updated`,
            duration: 3,
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          notification.error({
            message: "Error",
            description: `Vehicle ${vehicle.vehicleNumber} updated failed`,
            duration: 3,
          });
        });
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Error",
        description: `Vehicle ${vehicle.vehicleNumber} updated failed`,
        duration: 3,
      });
    }
  };

  return (
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
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Number"
        name="vehicleNumber"

        rules={[
          {
            required: true,
            message: "Please input your vehicle number!",
          },
        ]}
      >
        <Input
          placeholder="Vehicle number"
        />
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
        <Input
        placeholder="User name"/>
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
  );
};

export default EditVehicle;
