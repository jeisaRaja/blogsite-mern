import nanoid from "nanoid";
import User from "../Schema/User";

export const generateUsername = async (email: string) => {
  let username = email.split("@")[0];

  let isUsernameExist = await User.exists({ "personal_info.username": username });
  isUsernameExist ? username += nanoid.nanoid(5) : username

  return username;
}