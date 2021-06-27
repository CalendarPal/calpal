import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../store/auth";

const Welcome: React.FC = () => {
  const [loginWindow, setLoginWindow] = useState<Window | undefined>(undefined);
  const history = useHistory();
  const getUser = useAuth((state) => state.getUser);

  if (loginWindow) {
    loginWindow.onbeforeunload = async () => {
      await getUser(false);
      history.push("/");
    };
  }

  useEffect(() => {
    return () => {
      if (loginWindow) {
        loginWindow.close();
      }
    };
  });

  const openLoginWindow = () => {
    const popUp = window.open(
      "http://calpal.test/account/authenticate?loginOnly",
      "_blank"
    );
    setLoginWindow(popUp ?? undefined);
  };

  return (
    <React.Fragment>
      <h1 className="title has-text-centered">Welcome to CalPal</h1>
      <div
        onClick={() => openLoginWindow()}
        className="buttons is-centered mt-6"
      >
        <button className="button is-info">Login</button>
      </div>
      <p className="has-text-centered mt-6">
        Deserunt anim nisi ex non cillum nisi exercitation sint et. Amet ad anim
        adipisicing quis exercitation in id minim fugiat incididunt consectetur
        exercitation laborum. Aliqua incididunt aliquip nostrud et sunt
        adipisicing aliquip ea duis deserunt ut aliqua. Cillum pariatur proident
        in proident do esse excepteur ea duis consectetur Lorem est. Dolore qui
        Lorem minim occaecat.
      </p>
    </React.Fragment>
  );
};

export default Welcome;
