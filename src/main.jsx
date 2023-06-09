import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { store } from "./stores/auth/store";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
  // theme={{
  //   token: {
  //     colorPrimary: "#000000",
  //   },
  // }}
  >
    <StyleProvider hashPriority="high">
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </StyleProvider>
  </ConfigProvider>
);
