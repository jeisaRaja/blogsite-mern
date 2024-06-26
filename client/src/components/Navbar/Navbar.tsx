import { useEffect, useState } from "react";
import Button from "../Input/Button";
import MenuModal from "./MenuModal";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/useAppContext";
const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const {user} = useAppContext()

  useEffect(()=>{
    console.log(user)
  }, [user])
  return (
    <>
      <header className="w-full max-w-[1200px] mx-auto px-12 h-[100px] flex items-center justify-between py-5">
        <div className=""></div>
        <nav className="flex flex-row w-full">
          {user ? (
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
                    src={user.profile_img}
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
              <div className="flex ml-auto w-[200px] justify-end gap-2">
                <a href="/signin">
                  <Button dark={true} type={undefined}>
                    Sign In
                  </Button>
                </a>
                <a href="/signup">
                  <Button>Sign Up</Button>
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
