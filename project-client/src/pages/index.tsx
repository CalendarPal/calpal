import Head from "next/head";

import ProtectedRoute from "../HOC/ProtectedRoute";

export default ProtectedRoute(function Home() {
  return (
    <div>
      <Head>
        <title>Calpal: let us worry so you don't have too</title>
      </Head>
    </div>
  );
});
