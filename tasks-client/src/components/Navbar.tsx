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

  const navigationMenu = currentUser ? (
    <>
      <nav className="navbar is-fixed-top box-shadow-y">
        <div className="navbar-brand">
          <div className="navbar-burger burger toggler">
            <span></span>
            <span></span>
            <span></span>
          </div>
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
              <i className="fab fa-github"></i>
            </span>
          </a>

          <a
            className="navbar-item is-hidden-desktop"
            href="https://github.com/ReeceDonovan"
            target="_blank"
          >
            <span className="icon" style={{ color: "#55acee" }}>
              <i className="fa fa-twitter"></i>
            </span>
          </a>

          <div className="navbar-burger burger nav-toggler">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Home
            </Link>
            <Link to="/" className="navbar-item">
              Your Tasks
            </Link>
            <Link to="/" className="navbar-item">
              Your Projects
            </Link>
          </div>

          <div className="navbar-end">
            <a
              className="navbar-item is-hidden-desktop-only"
              href="https://github.com/ReeceDonovan"
              target="_blank"
              rel="noreferrer"
            >
              <span className="icon" style={{ color: "#333" }}>
                <i className="fa fa-github fa-2x"></i>
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
                <div className="navbar-item has-dropdown is-hoverable">
                  <figure className="image navbar-link">
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
                  <div className="navbar-dropdown is-right">
                    <a href="/account/" target="_blank">
                      <div className="navbar-item">Profile</div>
                    </a>
                    <div className="navbar-item">Settings</div>
                    <hr className="navbar-divider" />
                    <div className="navbar-item">
                      <p className="control" style={{ paddingTop: "5px" }}>
                        <a
                          className="bd-tw-button button"
                          target="_blank"
                          onClick={() => signOut()}
                          href="#signout"
                        >
                          <span className="icon">
                            <i className="fas fa-sign-out-alt"></i>
                          </span>
                          <span>Sign Out</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="columns is-variable is-0">
        <div>
          <div className="menu-container px-1 has-background-white">
            <div className="menu-wrapper py-1 is-sidebar-menu">
              <aside className="menu">
                <p className="menu-label has-text-lighter">General</p>
                <ul className="menu-list">
                  <li>
                    <Link to="/" className="is-active">
                      <i className="fas fa-tachometer-alt icon"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/edit">All Tasks</Link>
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
          </div>
        </div>
      </div>
    </>
  ) : undefined;

  return <>{navigationMenu}</>;
};

export default Navbar;
