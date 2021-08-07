import "../styles/tailwind.css";

import Axios from "axios";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../HOC/ProtectedRoute";

Axios.defaults.baseURL = "http://calpal.test/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps, router }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url?, token?) =>
          Axios.get(url || "undefined", {
            headers: token ? { Authorization: "Bearer " + token } : "",
          }).then((res) => res.data),
        dedupingInterval: 5000,
      }}
    >
      <ProtectedRoute router={router}>
        <Navbar />
        <div className="pt-14">
          <Component {...pageProps} />
        </div>
      </ProtectedRoute>
    </SWRConfig>
  );
}

export default App;
