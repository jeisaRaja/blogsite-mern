import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/userContext";

export default function MenuModal() {
  const auth = useUserContext();
  const username = auth.user?.username;

  async function logOutUser() {
    auth.logout();
  }

  return (
    <ul className="bg-white flex flex-col absolute right-[3rem] shadow-lg rounded-md border-gray-200 border-solid border-2 z-10">
      <Link
        to="/editor"
        className="cursor-pointer flex items-center gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-edit"></i>Write
      </Link>
      <Link
        to="/profile"
        className="cursor-pointer flex items-center gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-user"></i>Profile
      </Link>
      <Link
        to="/dashboard"
        className="cursor-pointer flex items-center gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rs-computer"></i>Dashboard
      </Link>
      <Link
        to=""
        className="cursor-pointer flex items-center gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-settings-sliders"></i>Settings
      </Link>
      <div
        className="cursor-pointer  hover:bg-gray-100 p-4 hover:text-red-500"
        onClick={logOutUser}
      >
        <p className="leading-[1.5rem]">Sign out of</p>
        <p className="leading-[1.5rem]">@{username}</p>
      </div>
    </ul>
  );
}
