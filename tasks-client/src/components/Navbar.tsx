import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, User } from "../store/auth";
import Loader from "../components/ui/Loader";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";

type NavbarProps = {
  currentUser?: User;
};

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { signOut } = useAuth();
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const placeHolderImage = (
    <div
      style={{
        height: 48,
        width: 48,
        backgroundColor: "hsl(0, 0%, 86%)",
        borderRadius: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {currentUser?.name ? currentUser.name[0].toUpperCase() : "U"}
      </div>
    </div>
  );

  // const navigationMenu = currentUser ? (
  //   <div className={`navbar-menu${isNavbarOpen ? " is-active" : ""}`}>
  //     <div className="navbar-start">
  //       <Link to="/" className="navbar-item">
  //         Your Day
  //       </Link>
  //       <Link to="/edit" className="navbar-item">
  //         Your List
  //       </Link>
  //     </div>
  //     <div className="navbar-end">
  //       <div className="navbar-item">
  //         <button onClick={() => signOut()} type="button" className="button">
  //           Sign Out
  //         </button>
  //       </div>
  //       <div className="navbar-item">
  //         <a href="/account/" target="_blank">
  //           <figure className="image">
  //             {currentUser.imageUrl ? (
  //               <img
  //                 src={currentUser.imageUrl}
  //                 alt="Profile"
  //                 style={{ width: "auto" }}
  //               />
  //             ) : (
  //               placeHolderImage
  //             )}
  //           </figure>
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // ) : undefined;

  // return (
  //   <nav className="navbar is-info" role="navigation">
  //     <div className="navbar-brand">
  //       <div className="navbar-item"></div>
  //       <div
  //         role="button"
  //         className={`navbar-burger burger${isNavbarOpen ? " is-active" : ""}`}
  //         aria-label="menu"
  //         aria-expanded="false"
  //         onClick={() => setNavbarOpen(!isNavbarOpen)}
  //       >
  //         <span aria-hidden="true"></span>
  //         <span aria-hidden="true"></span>
  //         <span aria-hidden="true"></span>
  //       </div>
  //     </div>

  //     {navigationMenu}
  //   </nav>
  // );
  const navigationMenu = currentUser ? (
    <>
      <nav className="navbar ">
        <div className="navbar-brand">
          <a className="navbar-item" href="http://calpal.test">
            <img
              src="https://media.discordapp.net/attachments/471231303317192735/860169767533281300/CalPal_betaLogo.jpg"
              alt="CalPal Logo"
              width="auto"
              height="auto"
            />
          </a>

          <a
            className="navbar-item is-hidden-desktop"
            href="https://github.com/ReeceDonovan"
            target="_blank"
          >
            <span className="icon" style={{ color: "#333" }}>
              <i className="fab fa-github fa-7x"></i>
            </span>
          </a>

          <a
            className="navbar-item is-hidden-desktop"
            href="https://github.com/ReeceDonovan"
            target="_blank"
          >
            <span className="icon" style={{ color: "#55acee;" }}>
              <i className="fa fa-twitter"></i>
            </span>
          </a>

          <div className="navbar-burger burger" data-target="navMenubd-example">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navMenubd-example" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item " href="http://bulma.io/expo/">
              Dashboard
            </a>
            <a className="navbar-item " href="http://bulma.io/expo/">
              Your Tasks
            </a>
            <a className="navbar-item " href="http://bulma.io/love/">
              Your Projects
            </a>
          </div>

          <div className="navbar-end">
            <a
              className="navbar-item is-hidden-desktop-only"
              href="https://github.com/ReeceDonovan"
              target="_blank"
            >
              <span className="icon" style={{ color: "#333;" }}>
                <i className="fa fa-github"></i>
              </span>
            </a>
            <div className="navbar-item">
              <div className="field is-grouped">
                <p className="control" style={{ paddingTop: "5px" }}>
                  <a
                    className="button is-primary"
                    href="https://github.com/ReeceDonovan"
                  >
                    <span className="icon">
                      <i className="fa fa-download"></i>
                    </span>
                    <span>Create</span>
                  </a>
                </p>
                <p className="control" style={{ paddingTop: "5px" }}>
                  <a
                    className="bd-tw-button button"
                    target="_blank"
                    onClick={() => signOut()}
                  >
                    <span className="icon">
                      <i className="fas fa-sign-out-alt"></i>
                    </span>
                    <span>Sign Out</span>
                  </a>
                </p>
                <a href="/account/" target="_blank">
                  <figure className="image">
                    {currentUser.imageUrl ? (
                      <img
                        src={currentUser.imageUrl}
                        alt="Profile"
                        style={{ width: "auto" }}
                      />
                    ) : (
                      placeHolderImage
                    )}
                  </figure>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="column is-2 is-sidebar-menu is-hidden-mobile"
        style={{ position: "absolute", minHeight: "100%" }}
      >
        <aside className="menu">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <a className="is-active">Dashboard</a>
            </li>
            <li>
              <a>All Tasks</a>
            </li>
          </ul>
          <p className="menu-label">Projects</p>
          <ul className="menu-list">
            <li>
              <a>Manage Your Projects</a>
              <ul>
                <li>
                  <a>Project #1</a>
                </li>
                <li>
                  <a>Project #2</a>
                </li>
                <li>
                  <a>Project #3</a>
                </li>
              </ul>
            </li>
          </ul>
          <p className="menu-label">Miscellaneous</p>
          <ul className="menu-list">
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  ) : undefined;

  return <>{navigationMenu}</>;
};

export default Navbar;
