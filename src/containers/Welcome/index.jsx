import React, { useState, useEffect } from "react";

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

import Checkin from "../../components/Home/Checkin";
import Checkout from "../../components/Home/Checkout";
import { Button, notification } from "antd";
import { sendEmail } from "../../services/mail";

const Welcome = () => {
  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
    getVehicleListFromStorage();
  }, []);

  const getVehicleListFromStorage = async () => {
    try {
      const vehiclesRef = collection(storage, "vehicles");
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehiclesList = vehiclesSnapshot.docs.map((doc) => {
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

  const onHanlerClearAllGate = async () => {
    console.log("clear all gate");
    for (let i = 1; i <= 3; i++) {
      await deleteDoc(doc(storage, "gates", i.toString()))
        .then(() => {
          notification.success({
            message: "Success",
            description: `Gate ${i} deleted`,
            duration: 3,
          });
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description: `Gate ${i} deleted failed`,
            duration: 3,
          });
        });
    }
    set(ref(database, "gate/gateIsFull"), Number(0));
  };

  const onHanlderSendTestMail = async () => {
    const msg = {
      to: "19119220@student.hcmute.edu.vn",
      from: "doankhietthanh@gmail.com",
      subject: "Test Email",
      text: "Hello, this is a test email sent from ReactJS using SendGrid!",
    };

    sendEmail(msg.to, msg.from, msg.subject, msg.text);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
      <Button
        className="mt-10 pt-10"
        type="primary"
        onClick={onHanlerClearAllGate}
      >
        Clear all gate
      </Button>
      <Button onClick={onHanlderSendTestMail}>Send test mail</Button>
      <div className="w-full h-full flex flex-row">
        <Checkin vehicleList={vehicleList} />
        <Checkout vehicleList={vehicleList} />
      </div>
    </div>
  );
};

export default Welcome;
