import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "../store/auth";

const Navbar: React.FC = () => {
  const { pathname } = useRouter();

  // console.log(pathname);

  const welcomePath = pathname === "/welcome";

  const { signOut } = useAuth();

  const [loginWindow, setLoginWindow] = useState<Window | undefined>(undefined);
  const history = useRouter();
  const getUser = useAuth((state) => state.getUser);

  if (loginWindow) {
    loginWindow.onbeforeunload = async () => {
      await getUser(false);
      history.push("/");
    };
  }

  useEffect(() => {
    return () => {
      if (loginWindow) {
        loginWindow.close();
      }
    };
  });

  const openLoginWindow = () => {
    const popUp = window.open(
      "http://calpal.test/account/authenticate?loginOnly",
      "_blank"
    );
    setLoginWindow(popUp ?? undefined);
    history.reload();
  };

  const openRegisterWindow = () => {
    const popUp = window.open(
      "http://calpal.test/account/authenticate?registerOnly",
      "_blank"
    );
    setLoginWindow(popUp ?? undefined);
    history.reload();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center px-5 bg-white h-14">
      {/* Logo and title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <img src="/CalpalLogo.jpg" className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">Calpal</Link>
        </span>
      </div>

      {/* Search Input */}
      {welcomePath && (
        <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i
            className="pl-4 pr-3 text-gray-500 fas fa-search"
            hidden={true}
          ></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
            placeholder="Search"
            disabled={true}
            hidden={true}
          />
        </div>
      )}

      {!welcomePath && (
        <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
            placeholder="Search"
          />
        </div>
      )}

      {/* Login and Signup */}
      {welcomePath && (
        <div className="flex">
          <Link href="#">
            <a
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
              onClick={() => openLoginWindow()}
            >
              log in
            </a>
          </Link>
          <Link href="#">
            <a
              className="w-32 py-1 leading-5 blue button"
              onClick={() => openRegisterWindow()}
            >
              sign up
            </a>
          </Link>
        </div>
      )}
      {/* Signout */}
      {!welcomePath && (
        <div className="flex">
          <Link href="http://calpal.test/account/account">
            <a className="w-32 py-1 mr-4 leading-5 blue button">edit account</a>
          </Link>
          <Link href="#">
            <a
              className="w-32 py-1 leading-5 hollow blue button"
              onClick={() => signOut()}
            >
              sign out
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Navbar;
