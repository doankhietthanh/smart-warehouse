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
import { ACTION_DB } from "../../utils/constant";
import { Button, notification, message } from "antd";

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
      await set(ref(database, `hardware/position/${i}`), Number(0));
    }
    //delete all child in collection "history"
    const historyRef = collection(storage, "history");
    const historySnapshot = await getDocs(historyRef);
    historySnapshot.docs.map(async (d) => {
      await deleteDoc(doc(storage, "history", d.id));
    });
    set(ref(database, "gate/gateIsFull"), Number(0));

    //clear image
    set(ref(database, "checkin/camera"), "");
    set(ref(database, "checkout/camera"), "");

    //clear hardware
    set(ref(database, "action"), ACTION_DB.RESET_HARDWARE);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
      <div className="w-full h-full flex flex-row">
        <Checkin vehicleList={vehicleList} />
        <Checkout vehicleList={vehicleList} />
      </div>
    </div>
  );
};

export default Welcome;
