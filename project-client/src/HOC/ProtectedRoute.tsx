import React from "react";

const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({
  user,
  router,
  children,
}: {
  user: any;
  router: any;
  children: any;
}) => {
  let unprotectedRoutes = ["/welcome"];

  let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;
  if (isBrowser() && !user && pathIsProtected) {
    router.push("/welcome");
  }

  var newChildren = React.Children.map(children, function (child) {
    return React.cloneElement(child, { user: user });
  });

  return newChildren;
};

export default ProtectedRoute;
