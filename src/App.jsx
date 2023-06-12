import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Login } from "./containers";
import { useDispatch, useSelector } from "react-redux";
import {
  signInWithGoogleStart,
  signInWithGoogleFailure,
  signInWithGoogleSuccess,
} from "./stores/auth/authSlice";
import { signInWithCredential } from "firebase/auth";
import { auth, GoogleAuthProvider } from "./services/firebase";
import Vehicle from "./containers/Vehicle";

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
        });
    } catch (e) {
      console.log(e);
      dispatch(signInWithGoogleFailure(e.message));
      localStorage.removeItem("token");
    }
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
