import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useUserContext } from "../contexts/userContext";
import toast, { Toaster } from "react-hot-toast";
import { emailRegex } from "../common/regex";
import axios from "axios";
import Button from "../components/Input/Button";

const Profile = () => {
  const { user, getUserSessionData } = useUserContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length < 4) {
      return toast.error("Username must be at least 4 characters");
    } else if (!emailRegex.test(email)) {
      return toast.error("Please provide a valid email");
    } else if (fullname.length < 4) {
      return toast.error("Fullname must be at least 4 characters");
    }
    const data = {
      username,
      email,
      fullname,
    };
    const res = await axios.put(
      `${import.meta.env.VITE_API_ROUTE}/user`,
      {data},
      { withCredentials: true }
    );
    if (res.status === 200) {
      console.log(res)
      setToggleEdit(false)
      // window.location.reload()
      getUserSessionData()
      return toast.success("Update success");
    }
    toast.error(res.data);
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFullname(user.fullname);
    }
  }, [user, toggleEdit]);

  return (
    <>
      <Navbar />
      <Toaster/>
      <div className="w-full max-w-full mx-auto flex flex-col items-center justify-center gap-4">
        <form
          className="w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] flex flex-col items-center gap-4 min-h-[350px]"
          onSubmit={(e) => handleSubmit(e)}
        >
          <img src={user?.profile_img} alt="" className="w-12 h-12" />
          <div className="flex flex-col w-full">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              className="p-2 border-2 bg-gray-100"
              readOnly={!toggleEdit}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              className="p-2 border-2 bg-gray-100"
              readOnly={!toggleEdit}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="fullname">Fullname</label>
            <input
              type="text"
              name="fullname"
              value={fullname}
              className="p-2 border-2 bg-gray-100"
              readOnly={!toggleEdit}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          {toggleEdit && (
            <Button
              type="submit"
              dark={true}
              // className="w-full px-4 py-2 rouned-sm bg-green-300 hover:bg-green-400"
            >
              Save
            </Button>
          )}
          <Button
            type="button"
            // className="border px-4 py-2 rouned-sm bg-gray-100 hover:bg-gray-200 w-full"
            onclick={()=>setToggleEdit(!toggleEdit)}
          >
            {toggleEdit ? "Cancel" : "Edit Profile"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Profile;
