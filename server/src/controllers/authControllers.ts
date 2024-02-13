import { Request, Response } from 'express'
import User, { UserDocument } from '../Schema/User';
import { formatUserData } from '../utils/formatUserData';
import bcrypt from 'bcrypt'
import { generateUsername } from '../utils/generateUsername';
import { getAuth } from 'firebase-admin/auth';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body.requestData as { email: string, password: string };

  const user: UserDocument | null = await User.findOne({ "personal_info.email": email });

  if (!user) {
    return res.status(400).json({ "error": "email or password is incorrect" });
  }
  if (user.google_auth) {
    return res.status(403).json({ "error": "Please log in using your google account" })
  }
  const isPasswordCorrect: boolean = bcrypt.compareSync(password, user.personal_info.password);
  if (!isPasswordCorrect) {
    return res.status(403).json({ "error": "email or password is incorrect" })
  }
  res.status(200).json(formatUserData(user));
}

export const signUp = async (req: Request, res: Response) => {
  const { fullname = '', email = '', password = '' } = req.body.requestData as { fullname: string, email: string, password: string };
  if (fullname.length < 3) {
    return res.status(403).json({ "error": "Fullname must be at least 3 letters" });
  }

  if (!email.length) {
    return res.status(403).json({ "error": "Email must be provided" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Email is invalid" })
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase" })
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    let username: string = await generateUsername(email);
    let user: UserDocument = new User({
      personal_info: { fullname, email, password: hashedPassword, username }
    })

    user.save().then((u) => {
      return res.status(200).json(formatUserData(u))
    }).catch(e => {
      if (e.code == 11000) {
        return res.status(400).json({ "error": "this email is already registered" })
      }
      return res.status(500).json({ "error": e.message })
    })
  });
}

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { access_token } = req.body.requestData as { access_token: string };
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name, picture } = decodedUser;
    const modifiedPicture = picture?.replace("s96-c", "s380-c");

    const user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (!user) {
      const username: string = await generateUsername(email!);
      const newUser: UserDocument = new User({
        personal_info: { fullname: name, email, username },
        google_auth: true
      });
      await newUser.save();
      res.status(200).json(formatUserData(newUser));
    } else {
      if (!user.google_auth) {
        res.status(403).json({ "error": "This email was signed up without Google. Please use email and password to log in." });
      } else {
        res.status(200).json(formatUserData(user));
      }
    }
  } catch (error:any) {
    console.error("Error in googleAuth:", error);
    res.status(500).json({ "error": error.message });
  }
};

