import React from "react";

const Welcome: React.FC = () => {
  return (
    <React.Fragment>
      <h1 className="title has-text-centered">Welcome to CalPal</h1>
      <div
        // onClick={() => openLoginWindow()}
        className="mt-6 buttons is-centered"
      >
        <button className="button is-info">Login</button>
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
