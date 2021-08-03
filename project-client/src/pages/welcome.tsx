import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useAuth } from "../store/auth";

const Welcome: React.FC = () => {
  const getUser = useAuth((state) => state.getUser);
  const [_, setBeginUserLoad] = useState(false);
  const currentUser = useAuth((state) => state.currentUser!);

  useEffect(() => {
    getUser(false);
    setBeginUserLoad(true);
  }, [getUser]);

  const Router = useRouter();

  if (currentUser) {
    Router.push("/");
    return null;
  }

  return (
    <React.Fragment>
      <h1 className="text-center title">Welcome to CalPal</h1>
      <div className="mt-6 button">
        <button className="w-32 py-1 leading-5 blue button">Login</button>
      </div>
      <p className="mt-6 has-text-centered">
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
