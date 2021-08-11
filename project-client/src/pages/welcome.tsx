import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useAuth } from "../store/auth";

const Welcome: React.FC = (props: any) => {
  const Router = useRouter();

  if (props.user) {
    Router.push("/");
    return null;
  }

  // const { signOut } = useAuth();

  const [loginWindow, setLoginWindow] = useState<Window | undefined>(undefined);
  const history = useRouter();
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
    history.reload();
  };

  const openRegisterWindow = () => {
    const popUp = window.open(
      "http://calpal.test/account/authenticate?registerOnly",
      "_blank"
    );
    setLoginWindow(popUp ?? undefined);
    history.reload();
  };

  return (
    <React.Fragment>
      <div className="px-6 md:mr-64">
        <div className="top-0 flex items-center justify-between h-16">
          <h1>Calpal</h1>
          <div className="flex">
            <Link href="#">
              <a
                className="w-32 py-1 mr-4 leading-5 hollow blue button"
                onClick={() => openLoginWindow()}
              >
                log in
              </a>
            </Link>
            <Link href="#">
              <a
                className="w-32 py-1 leading-5 blue button"
                onClick={() => openRegisterWindow()}
              >
                sign up
              </a>
            </Link>
          </div>
        </div>
        <div className="w-full pt-16 mx-auto h-96">
          <h1 className="text-center title">Welcome to CalPal</h1>
          <p className="mt-6 has-text-centered">
            Deserunt anim nisi ex non cillum nisi exercitation sint et. Amet ad
            anim adipisicing quis exercitation in id minim fugiat incididunt
            consectetur exercitation laborum. Aliqua incididunt aliquip nostrud
            et sunt adipisicing aliquip ea duis deserunt ut aliqua. Cillum
            pariatur proident in proident do esse excepteur ea duis consectetur
            Lorem est. Dolore qui Lorem minim occaecat.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
