import "../styles/tailwind.css";

import Axios from "axios";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import React from "react";
import { SWRConfig } from "swr";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../HOC/ProtectedRoute";
import { useAuth } from "../store/auth";

Axios.defaults.baseURL = "http://calpal.test/api";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string, token: string) => {
  try {
    const res = await Axios.get(url, {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data.errors;
  }
};

function App({ Component, pageProps, router }: AppProps) {
  const getUser = useAuth((state) => state.getUser);
  const [beginUserLoad, setBeginUserLoad] = useState(false);
  const isLoading = useAuth((state) => state.isLoading);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
    setBeginUserLoad(true);
  }, [getUser]);

  const content =
    beginUserLoad && !isLoading ? (
      <>
        <Sidebar />
        <div className="relative min-h-screen md:ml-64 bg-blueGray-100">
          <Navbar />
          <ProtectedRoute user={currentUser} router={router}>
            <Component {...pageProps} />
          </ProtectedRoute>
        </div>
      </>
    ) : undefined;

  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 5000,
      }}
    >
      {isLoading ||
        (!beginUserLoad && <p className="text-lg text-center">Loading..</p>)}
      {content}
    </SWRConfig>
  );
}

export default App;
