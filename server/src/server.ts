import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './Schema/User';
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

const fileContent = fs.readFileSync('./service_account_firebase.json', 'utf-8');
const serviceAccountKey = JSON.parse(fileContent);

const connectionString: string = process.env.DB_STRING || '';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect(connectionString, {
  autoIndex: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const server = express();
server.use(express.json());
server.use(cors());

admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountKey) }
);

const PORT: number = parseInt(process.env.PORT || '3000');

server.listen(PORT, () => {
  console.log(`Listening to PORT -> ${PORT}`);
});

server.use(authRoutes)

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
          console.log(user)
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

server.post("/upload-image",isAuthenticated, upload.single('image'), async (req, res) => {
  const bannerImage = req.file as UploadedFile

  try {
    let pathFromBucket = await uploadFile(bannerImage);
    return res.status(200).json({ publicUrl: pathFromBucket })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: "Failed to upload image" })
  }
})