import { useState } from "react";
import Button from "../Input/Button";
import MenuModal from "./MenuModal";
import { useUserContext } from "../../contexts/userContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const auth = useUserContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="w-full max-w-[1200px] mx-auto px-12 h-[100px] flex items-center justify-between py-5">
        <div className=""></div>
        <nav className="flex flex-row w-full">
          {auth.user ? (
            <div className="flex w-full items-center">
              <ul className="mr-auto">
                <div className="py-1 cursor-pointer">
                  <Link to="/" className="text-2xl font-semibold py-2">
                    Sharify
                  </Link>
                </div>
              </ul>
              <ul className="ml-auto">
                <li>
                  <img
                    src={auth.user.profile_img}
                    alt=""
                    className="w-12 h-12 rounded-full"
                    onClick={() => {
                      setShowModal((prev) => !prev);
                    }}
                  />
                  {showModal ? (
                    <>
                      <MenuModal />
                      <div
                        className="w-screen h-screen fixed left-0 top-0 -z-0"
                        onClick={() => setShowModal(false)}
                      ></div>
                    </>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <div className="w-full max-w-[1200px] mx-auto flex items-center">
              <div className="py-1 cursor-pointer">
                <Link to="/" className="text-2xl font-semibold py-2">
                  Sharify
                </Link>
              </div>
              <ul className="flex gap-3 ml-auto">
                <li>
                  <a href="/signin">
                    <Button dark={true} type={undefined}>
                      Sign In
                    </Button>
                  </a>
                </li>
                <li>
                  <a href="/signup">
                    <Button>Sign Up</Button>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
