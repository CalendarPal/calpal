import { useRouter } from "next/router";
import React from "react";

const Welcome: React.FC = (props: any) => {
  const Router = useRouter();

  if (props.user) {
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
