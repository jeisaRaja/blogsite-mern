import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import User, { UserDocument, UserSession } from './Schema/User';
import cors from 'cors';
import admin from "firebase-admin";
import * as fs from 'fs';
import { getAuth } from "firebase-admin/auth";
import { uploadFile } from './services/ImageStore';
import multer from 'multer';
import { generateUsername } from './utils/generateUsername';
import { formatUserData } from './utils/formatUserData';
import { UploadedFile } from './services/ImageStore';
import { authRoutes } from './routes/authRoutes';
import { isAuthenticated } from './middlewares/isAuthenticated';
import editorRoutes from './routes/editorRoutes';
import session = require('express-session');
import blogsRouter from './routes/blogRoutes';

const fileContent = fs.readFileSync('./service_account_firebase.json', 'utf-8');
const serviceAccountKey = JSON.parse(fileContent);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const server = express();
server.use(express.json());
server.use(cors({
  origin: 'http://localhost:5173',
  // origin: '*',
  credentials: true,
  methods: "PUT, POST, PATCH, DELETE, GET"
}));

declare module "express-session" {
  interface SessionData {
    user: UserSession;
  }
}

// declare global {
//   namespace Express {
//     interface Request {
//       user: UserDocument
//     }
//   }
// }

server.use(session({
  secret: process.env.SESSION_SECRET!,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: false
  },
  resave: true,
  saveUninitialized: false,
}));

admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountKey) }
);

server.use(authRoutes)
server.use('/editor', editorRoutes)
server.use('/blogs', blogsRouter)
server.get('/test', (req, res) => {
  console.log(`request from ${req}`)
  console.log(req.headers)
  res.status(200).json({ status: "OK", time: new Date })
})

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body.requestData;
  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      picture = picture?.replace("s96-c", "s380-c");
      try {
        let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
        if (!user) {
          let username = await generateUsername(email!);
          user = new User({
            personal_info: { fullname: name, email, username },
            google_auth: true
          })
          await user.save()
        }
        else {
          if (!user.google_auth) {
            return res.status(403).json({ "error": "This email was signed up without google, please use email and password to log in" })
          }
        }
        return res.status(200).json(formatUserData(user))
      } catch (e: any) {
        return res.status(500).json({ "error": e.message })
      }
    })
})

server.post("/upload-image", isAuthenticated, upload.single('image'), async (req, res) => {
  const bannerImage = req.file as UploadedFile

  try {
    let pathFromBucket = await uploadFile(bannerImage);
    return res.status(200).json({ publicUrl: pathFromBucket })
  } catch (e) {
    return res.status(500).json({ message: "Failed to upload image" })
  }
})

export default server