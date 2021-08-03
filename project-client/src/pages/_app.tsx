import "../styles/tailwind.css";

import Axios from "axios";
import { AppProps } from "next/app";
import { Fragment } from "react";

import Navbar from "../components/Navbar";

Axios.defaults.baseURL = "http://calpal.test/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Navbar />
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
