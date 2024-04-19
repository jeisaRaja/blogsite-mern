import Navbar from "../components/Navbar/Navbar";
import { useUserContext } from "../contexts/userContext";

const Profile = () => {
  const { user } = useUserContext();

  return (
    <>
      <Navbar />
      <form className="w-full max-w-[300px] mx-auto flex flex-col items-center justify-center gap-4">
        <img src={user?.profile_img} alt="" className="w-12 h-12" />
        <div className="flex flex-col w-full">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={user?.username}
            className="p-2 border-2 border-gray-300"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={user?.email}
            className="p-2 border-2 border-gray-300"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="fullname">Fullname</label>
          <input
            type="text"
            name="fullname"
            value={user?.fullname}
            className="p-2 border-2 border-gray-300"
          />
        </div>
      </form>
    </>
  );
};

export default Profile;
