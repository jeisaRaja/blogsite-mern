import { useState } from "react";
import Button from "../Input/Button";
import MenuModal from "./MenuModal";
import { useUserContext } from "../../contexts/userContext";
const Navbar = () => {
  const { user } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const access_token = user?.access_token;

  const profilPicture = user?.profile_img;
  return (
    <>
      <header className="w-full h-[100px] flex items-center justify-between py-5 px-[100px]">
        <div className=""></div>
        <nav className="flex flex-row w-full">
          {access_token ? (
            <div className="flex w-full items-center">
              <ul className="mr-auto">
                <div className="py-1 cursor-pointer">
                  <li className="text-2xl font-semibold p-2">Sharify</li>
                </div>
              </ul>
              <ul className="ml-auto">
                <li>
                  <img
                    src={profilPicture}
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
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
