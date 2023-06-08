import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Menu from "../Menu";
import {
  signInWithGoogleFailure,
  signInWithGoogleStart,
  signInWithGoogleSuccess,
} from "../../stores/auth/authSlice";
import { auth, signOut } from "../../services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authStore = useSelector((state) => state.auth);
  const user = authStore.user;

  useEffect(() => {}, [user]);

  const handlerSignOutWithGoogle = () => {
    dispatch(signInWithGoogleStart());
    signOut(auth)
      .then(() => {
        localStorage.removeItem("token");
        history.push("/");
        dispatch(
          signInWithGoogleSuccess({
            uid: null,
            displayName: null,
            email: null,
            photoURL: null,
          })
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        dispatch(signInWithGoogleFailure(errorMessage));
        console.log(error);
      });
  };

  return (
    <div className="bg-white w-screen shadow-md h-[60px] flex justify-center items-center sticky top-0 z-10">
      <div className="container flex mx-auto justify-between items-center">
        <div className="flex gap-11 ">
          <h1 className="text-4xl font-thin py-2">Logo</h1>
          <Menu />
        </div>
        <div className="flex justify-center items-center gap-2 cursor-pointer">
          <Avatar
            size={40}
            className="bg-[#4ABF78] flex justify-center items-center"
            src={user?.photoURL}
          >
            <UserOutlined className="flex justify-center items-center" />
          </Avatar>
          <LogoutOutlined onClick={handlerSignOutWithGoogle} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
