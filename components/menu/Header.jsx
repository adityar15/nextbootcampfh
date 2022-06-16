import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { localapi } from "../../assets/api";
import Logo from "../Logo";

const NavLink = dynamic(() =>
  import(/*webpackChunkName:"navlink"*/ "./NavLink")
);
const Hamburger = dynamic(() =>
  import(/*webpackChunkName: "hamburger"*/ "./Hamburger")
);
const NavCart = dynamic(() =>
  import(/*webpackChunkName: "navcart"*/ "../cart/NavCart")
);

function Header() {
  const [show, setShow] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    localapi.get("/loginstatus").then((res) => {
      console.log(res.data)
      setIsLoggedIn(res.data.loggedIn);
      setShowMenu(true);
    });
  }, []);

  return (
    <header
      className={`flex md:flex-row flex-col md:items-center w-full bg-red-400 md:justify-between overflow-hidden ${
        show  ? "h-screen" : "h-36"
      } transition-all duration-200 ease-in-out`}
    >
      <div className="flex justify-between items-center">
        <Logo />
        <NavCart className="md:hidden" />
        <Hamburger clicked={() => setShow(!show)} />
      </div>

      {showMenu && (
        <ul className="flex md:flex-row flex-col md:items-center md:mr-8 md:space-x-5 md:space-y-0 space-y-3 mt-5 md:mt-0 ml-4 md:ml-0">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/">Courses</NavLink>
          {!isLoggedIn && (
            <>
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/">Register</NavLink>
            </>
          )}
          <NavCart className="hidden md:block" />
        </ul>
      )}
    </header>
  );
}

export default Header;
