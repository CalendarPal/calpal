import Head from "next/head";

import ProtectedRoute from "../HOC/ProtectedRoute";

export default ProtectedRoute(function Home() {
  return (
    <div className="pt-14">
      <Head>
        <title>Calpal: let us worry so you don't have too</title>
      </Head>
      <div className="container">
        <h1>Tasks Ending Soon</h1>
      </div>
    </div>
  );
});
