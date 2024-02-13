import jwt from 'jsonwebtoken'
import { UserDocument } from '../Schema/User';

export const formatUserData = (user: UserDocument) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE!, {expiresIn: '5m'})
  return (
    {
      access_token: accessToken,
      profile_img: user.personal_info.profile_img,
      username: user.personal_info.username,
      fullname: user.personal_info.fullname,
    }
  )
}