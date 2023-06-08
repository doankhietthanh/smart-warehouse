import React, { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { auth } from "../services/firebase";
import { useSelector } from "react-redux";
import { convertLegacyProps } from "antd/es/button/button";

function PrivateRoute(props) {
  const history = useHistory();

  const tokenStore = localStorage.getItem("token");

  useEffect(() => {
    if (!tokenStore) {
      history.push("/");
    }
  }, [tokenStore]);

  return <Route {...props}></Route>;
}

export default PrivateRoute;
