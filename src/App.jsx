import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Login } from "./containers";
import { useDispatch } from "react-redux";
import {
  signInWithGoogleStart,
  signInWithGoogleFailure,
  signInWithGoogleSuccess,
} from "./stores/auth/authSlice";
import { signInWithCredential } from "firebase/auth";
import { auth, GoogleAuthProvider } from "./services/firebase";
import Vehicle from "./containers/Vehicle";
import {
  database,
  ref,
  onValue,
  storage,
  doc,
  setDoc,
} from "./services/firebase";
import emailjs from "@emailjs/browser";
import { formatTime, TIME_SEND_MAIL_MS } from "./utils/constant";

function App() {
  const tokenStore = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    getUserInfo();
  }, [tokenStore]);

  const getUserInfo = () => {
    dispatch(signInWithGoogleStart());
    try {
      if (!tokenStore) return;
      signInWithCredential(
        auth,
        GoogleAuthProvider.credential(null, tokenStore)
      )
        .then((result) => {
          // Signed in
          const user = result.user;
          const { uid, displayName, email, photoURL } = user;
          dispatch(
            signInWithGoogleSuccess({ uid, displayName, email, photoURL })
          );
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          localStorage.removeItem("token");
          window.location.reload();
        });
    } catch (e) {
      console.log(e);
      dispatch(signInWithGoogleFailure(e.message));
      localStorage.removeItem("token");
    }
  };

  // Hanlder with firebase

  // hanlder Alert
  const [temperatureTemp, setTemperatureTemp] = useState(
    localStorage.getItem("temperature") || 0
  );
  const [humidityTemp, setHumidityTemp] = useState(
    localStorage.getItem("humidity") || 0
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log(1241241);
      getAlertSensorFromDB();
    }, TIME_SEND_MAIL_MS);
    return () => clearInterval(interval);
  }, []);

  const getAlertSensorFromDB = async () => {
    try {
      const alertRef = ref(database, "notification");
      onValue(alertRef, (snapshot) => {
        const data = snapshot.val();
        const humidity = data.humidity;
        const temperature = data.temperature;

        if (temperature.currentValue == temperatureTemp) return;
        else {
          setTemperatureTemp(temperature.currentValue);
          localStorage.setItem("temperature", temperature.currentValue);
          setAlertToStorage("temperature", temperature);
        }

        if (humidity.currentValue == humidityTemp) return;
        else {
          setHumidityTemp(humidity.currentValue);
          localStorage.setItem("humidity", humidity.currentValue);
          setAlertToStorage("humidity", humidity);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const setAlertToStorage = (sensorName, data) => {
    const now = Math.round(new Date().getTime() / 1000).toString();
    try {
      setDoc(doc(storage, `alert_${sensorName}`, now), {
        value: data?.currentValue,
        type: data?.type,
      });
      sendAlertEmail(sensorName, data, formatTime(now * 1000));
    } catch (e) {
      console.log(e);
    }
  };

  const sendAlertEmail = (sensorName, data, time) => {
    let typeAlert = "";
    if (data?.type == "upper") typeAlert = "high";
    else if (data?.type == "lower") typeAlert = "low";

    const userData = JSON.parse(localStorage.getItem("user"));

    const dataEmail = {
      to_email: userData?.email,
      to_name: userData?.displayName,
      time: time,
      sensorName: sensorName.charAt(0).toUpperCase() + sensorName.slice(1),
      typeAlert: typeAlert,
      value: data?.currentValue,
    };
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TENMPLETE_ALERT_ID,
        dataEmail,
        import.meta.env.VITE_EMAILJS_USER_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>

        <Route exact path="/vehicle">
          <Vehicle />
        </Route>

        <Route path="/v1">
          <Home />
        </Route>

        <Route path="/404">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-9xl font-bold">404</h1>
            <h2 className="text-3xl font-bold">Page not found</h2>
          </div>
        </Route>

        <Route path="*">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-9xl font-bold">404</h1>
            <h2 className="text-3xl font-bold">Page not found</h2>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
