import React, { useEffect, useState } from "react";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
import Loader from "./components/ui/Loader";
import AuthRoute from "./routes/AuthRoute";
import { useAuth } from "./store/auth";
import Edit from "./views/Edit";
import Overview from "./views/Overview";
import Welcome from "./views/Welcome";

const App: React.FC = () => {
  const getUser = useAuth((state) => state.getUser);
  const [beginUserLoad, setBeginUserLoad] = useState(false);
  const isLoading = useAuth((state) => state.isLoading);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
    setBeginUserLoad(true);
  }, [getUser]);

  const routes =
    beginUserLoad && !isLoading ? (
      <Switch>
        <Route exact path="/welcome">
          <Welcome />
        </Route>
        <AuthRoute
          user={currentUser}
          exact
          path="/edit"
          redirectPath="/welcome"
        >
          <Edit />
        </AuthRoute>
        <AuthRoute user={currentUser} exact path="/" redirectPath="/welcome">
          <Overview />
        </AuthRoute>
      </Switch>
    ) : undefined;

  return (
    <>
      <BrowserRouter>
        <Navbar currentUser={currentUser} />
        <div className="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
          {isLoading || (!beginUserLoad && <Loader radius={200} />)}
          {routes}
        </div>
      </BrowserRouter>
      <ReactQueryDevtools />
    </>
  );
};

export default App;
