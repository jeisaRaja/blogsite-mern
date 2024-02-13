import { useState } from "react";
import { useUserContext } from "../../common/context";
import Button from "../Input/Button";
import MenuModal from "./MenuModal";

const Navbar = () => {
  const { user } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const access_token = user?.access_token;

  const profilPicture = user?.profile_img;
  return (
    <>
      <header className="w-full h-[50px] flex items-center justify-between py-10 px-[100px]">
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
                  {showModal ? <MenuModal /> : ""}
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
