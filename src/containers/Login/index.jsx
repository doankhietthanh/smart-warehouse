import React, { useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  signInWithGoogleStart,
  signInWithGoogleFailure,
  signInWithGoogleSuccess,
} from "../../stores/auth/authSlice";
import { useHistory } from "react-router-dom";
import {
  auth,
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../services/firebase";
import { notification } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import Welcome from "./../Welcome/index";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const tokenStore = localStorage.getItem("token");
  console.log(tokenStore);

  useEffect(() => {
    if (!tokenStore) return;
    history.push("/v1/home");
  }, []);

  const handleSignInWithGoogle = () => {
    dispatch(signInWithGoogleStart());
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        localStorage.setItem("token", token);
        dispatch(
          signInWithGoogleSuccess({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );
        notification.success({
          message: "Success",
          description: `Login success ${user.displayName}`,
          duration: 3,
        });
        history.push("v1/home");
      })
      .catch((error) => {
        const errorMessage = error.message;
        dispatch(signInWithGoogleFailure(errorMessage));
        notification.error({
          message: "Error",
          description: `Login failed ${errorMessage}`,
          duration: 3,
        });
      });
  };

  return (
    <div className="w-full h-screen flex flex-col gap-16 justify-center items-center bg-cover bg-[url('https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500')]">
      <h1 className="text-white text-5xl">
        Welcome to Smart Warehouse workplace
      </h1>
      <Button
        type="primary"
        size="large"
        icon={<GoogleOutlined />}
        onClick={handleSignInWithGoogle}
      >
        Login with Google
      </Button>
    </div>
  );
};

export default Login;
