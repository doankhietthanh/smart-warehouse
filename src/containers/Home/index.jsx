import React from "react";
import PrivateRoute from "../../components/PrivateRouter";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Welcome, Dashboard, Profile, Settings } from "..";
import Navbar from "../../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex gap-2 items-start relative h-[calc(100vh-60px)] w-screen p-5">
        <Switch>
          <PrivateRoute path={"/v1/home"}>
            <Welcome />
          </PrivateRoute>

          <PrivateRoute path={"/v1/dashboard"}>
            <Dashboard />
          </PrivateRoute>

          <PrivateRoute path={"/v1/settings"}>
            <Settings />
          </PrivateRoute>

          <PrivateRoute path={"/v1/profile"}>
            <Profile />
          </PrivateRoute>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
