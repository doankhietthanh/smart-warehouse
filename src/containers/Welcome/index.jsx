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
  updateDoc,
  deleteField,
} from "../../services/firebase";

import Checkin from "../../components/Home/Checkin";
import Checkout from "../../components/Home/Checkout";
import { ACTION_DB, UNCHECKED_QR } from "../../utils/constant";
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

    // delete all child in collection "vehicles"
    const vehicleRef = collection(storage, "vehicles");
    const vehicleSnapshot = await getDocs(vehicleRef);
    vehicleSnapshot.docs.map(async (d) => {
      console.log(d.id);
      await updateDoc(doc(storage, "vehicles", d.id), {
        gate: deleteField(),
      });
    });

    set(ref(database, "gate/gateIsFull"), Number(0));

    //clear image
    set(ref(database, "checkin/camera"), "");
    set(ref(database, "checkin/gate"), UNCHECKED_QR);

    set(ref(database, "checkout/camera"), "");
    set(ref(database, "checkout/gate"), UNCHECKED_QR);

    //clear hardware
    set(ref(database, "action"), ACTION_DB.RESET_HARDWARE);

    localStorage.removeItem("counterVehicle");

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
