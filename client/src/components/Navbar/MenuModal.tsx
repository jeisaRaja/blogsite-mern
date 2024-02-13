import { Link } from "react-router-dom";
import { useUserContext } from "../../common/context";
import { removeFromSession } from "../../common/session";

export default function MenuModal() {
  const { user } = useUserContext();
  const username = user?.username;
  function logOutUser() {
    removeFromSession("user");
  }
  return (
    
    <ul className="flex flex-col absolute right-[3rem] drop-shadow-sm rounded-md border-gray-100 border-solid border-2">
      <Link
        to="/editor"
        className="cursor-pointer flex gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-edit"></i>Write
      </Link>
      <Link
        to=""
        className="cursor-pointer flex gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-user"></i>Profile
      </Link>
      <Link
        to=""
        className="cursor-pointer flex gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rs-computer"></i>Dashboard
      </Link>
      <Link
        to=""
        className="cursor-pointer flex gap-3 hover:bg-gray-100 p-4 w-[200px]"
      >
        <i className="fi fi-rr-settings-sliders"></i>Settings
      </Link>
      <div
        className="cursor-pointer flex flex-col gap-2 hover:bg-gray-100 p-4 hover:text-red-500"
        onClick={logOutUser}
      >
        Sign out of <p>@{username}</p>
      </div>
    </ul>
  );
}
