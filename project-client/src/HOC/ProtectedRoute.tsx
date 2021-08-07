import { useEffect, useState } from "react";

import { useAuth } from "../store/auth";

const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({
  router,
  children,
}: {
  router: any;
  children: any;
}) => {
  const getUser = useAuth((state) => state.getUser);
  const [_, setBeginUserLoad] = useState(false);
  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    getUser(true);
    setBeginUserLoad(true);
  }, [getUser]);

  let unprotectedRoutes = ["/welcome"];

  let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;
  if (isBrowser() && !currentUser && pathIsProtected) {
    router.push("/welcome");
  }

  return children;
};

export default ProtectedRoute;
