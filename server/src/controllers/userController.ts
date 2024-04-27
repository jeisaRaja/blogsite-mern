import Ajv from "ajv"
import { Request, Response } from "express"
import User from "../Schema/User"

const ajv = new Ajv()

interface UserUpdate {
  username?: string
  email?: string
  fullname?: string
  profile_picture?: string
}

const validateUserUpdate = ajv.compile(
  {
    type: "object",
    properties: {
      username: { type: "string" },
      email: { type: "string" },
      fullname: { type: "string" },
      profile_picture: { type: "string" },
    },
    additionalProperties: false,
  }
)

export const updateUser = async (req: Request, res: Response) => {
  const { data }: { data: UserUpdate } = req.body
  console.log(data)
  if (!validateUserUpdate(data)) return res.status(400).json({ error: "user data invalid" })

  const updateObj: { [key: string]: string | undefined } = {
    "personal_info.username": data.username,
    "personal_info.email": data.email,
    "personal_info.fullname": data.fullname
  };

  if (data.profile_picture !== undefined) {
    updateObj["personal_info.profile_picture"] = data.profile_picture;
  }
  const user = await User.findByIdAndUpdate(req.session.user?._id, updateObj, { new: true })
  if (!user) {
    return res.status(400).json({ error: "cannot update the profile" })
  }
  return res.status(200).json({ user, message: "update user profile success" })
} 