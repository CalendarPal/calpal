import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "../store/auth";

const ProtectedRoute = (ProtectedComponent: React.FC) => {
  return (props: any) => {
    if (typeof window !== "undefined") {
      const getUser = useAuth((state) => state.getUser);
      const [_, setBeginUserLoad] = useState(false);
      const currentUser = useAuth((state) => state.currentUser!);

      useEffect(() => {
        getUser(true);
        setBeginUserLoad(true);
      }, [getUser]);

      const Router = useRouter();

      if (!currentUser) {
        Router.push("/welcome");
        return null;
      } else {
        props = { ...props, currentUser };
        return <ProtectedComponent {...props} />;
      }
    }

    return null;
  };
};

export default ProtectedRoute;
