import jwt from 'jsonwebtoken'
import { UserDocument, UserSession } from '../Schema/User';

export const formatUserData = (user: UserDocument) => {
  return (
    {
      user_id: user._id,
      profile_img: user.personal_info.profile_img,
      username: user.personal_info.username,
      fullname: user.personal_info.fullname,
      email: user.personal_info.email
    }
  )
}