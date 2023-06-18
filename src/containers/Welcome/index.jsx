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
        console.log(doc.data());
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

  return (
    <div className="w-full h-full flex flex-row gap-5 justify-center items-center">
      <Checkin vehicleList={vehicleList} />
      <Checkout vehicleList={vehicleList} />
    </div>
  );
};

export default Welcome;
