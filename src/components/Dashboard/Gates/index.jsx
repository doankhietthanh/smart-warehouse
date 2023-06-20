import React, { useState, useEffect } from "react";
import {
  database,
  ref,
  set,
  onValue,
  storage,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
} from "../../../services/firebase";
import { formatTime } from "../../../utils/constant";

const Gates = () => {
  const [gates, setGates] = useState([]);
  const [gateSelected, setGateSelected] = useState(null);
  const [gatesColor, setGatesColor] = useState([]);
  const [totalGate, setTotalGate] = useState(0);
  const [gateUsed, setGateUsed] = useState([]);

  useEffect(() => {
    getGatesFromStorage();
    onValue(ref(database, "gate/totalGate"), (snapshot) => {
      setTotalGate(snapshot.val());
    });
  }, []);

  useEffect(() => {
    // if (gates.length === 0) return;
    const gatesColor = [];
    for (let i = 1; i <= totalGate; i++) {
      gatesColor.push({
        gate: i,
        color: "bg-green-500",
      });
    }
    console.log(gatesColor);

    if (gateUsed.length !== 0) {
      gateUsed.forEach((id) => {
        const index = gatesColor.findIndex((gate) => {
          console.log(gate.gate, id);
          return gate.gate == id;
        });
        console.log(index);
        if (index !== -1) {
          gatesColor[index].color = "bg-red-500";
        }
      });
    }
    setGatesColor(gatesColor);
  }, [gates, totalGate, gateSelected]);

  const getGatesFromStorage = async () => {
    try {
      const gatesRef = collection(storage, "gates");
      const gatesSnapshot = await getDocs(gatesRef);
      const gateUsed = [];
      const gatesList = gatesSnapshot.docs.map((doc) => {
        gateUsed.push(doc.id);
        return doc.data();
      });

      console.log(gateUsed, gatesList);
      setGates(gatesList);
      setGateUsed(gateUsed);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGateClick = (id) => {
    console.log(gates, id);
    gates.forEach((gate) => {
      if (gate.gate == id) {
        console.log(gate);
        setGateSelected(gate);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-row justify-center items-center">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-full">
          <div>
            Total gates: <span className="font-medium text-3xl">3</span>
          </div>
          <div className="w-full flex justify-center items-center gap-20">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="w-[50px] h-[50px] bg-red-500 rounded-sm p-5 flex justify-center items-center"></div>
              <div>Full</div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="w-[50px] h-[50px] bg-green-500 rounded-sm p-5 flex justify-center items-center"></div>
              <div>Empty</div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full grid grid-cols-3 justify-items-center items-center gap-5">
          {gatesColor.map((gate) => (
            <div
              className={`w-[200px] h-[300px] rounded-xl p-5 flex justify-center items-center ${
                gate.color
              } ${
                gateSelected?.gate == gate?.gate
                  ? "border-2 border-purple-800"
                  : ""
              } cursor-pointer`}
              onClick={() => handleGateClick(gate.gate)}
            >
              <p className="text-3xl">{gate.gate}</p>
            </div>
          ))}
        </div>
      </div>
      {gateSelected && (
        <div className="w-[350px] h-full">
          <div className="w-full text-xl text-center">Vehicle information</div>
          <div className="w-full flex flex-col mt-10 gap-5 ">
            <div className="w-full flex justify-between">
              <span>Gate</span>
              <span className="text-2xl">{gateSelected?.gate}</span>
            </div>
            <div className="w-full flex justify-between">
              <span>Vehicle</span>
              <span className="text-xl">{gateSelected?.vehicleNumber}</span>
            </div>
            <div className="w-full flex justify-between">
              <span>User</span>
              <span className="text-xl">{gateSelected?.username}</span>
            </div>
            <div className="w-full flex justify-between">
              <span>Email</span>
              <span>{gateSelected?.email}</span>
            </div>
            <div className="w-full flex justify-between">
              <span>Checkin</span>
              <span>{formatTime(gateSelected?.time * 1000)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gates;
