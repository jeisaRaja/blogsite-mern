import { Request, Response } from "express";
import Blog from "../Schema/Blog";
import User from "../Schema/User";
import { nanoid } from "nanoid";
import Ajv from "ajv";
import { formatUserData } from "../utils/formatUserData";
import { auth } from "firebase-admin";

const ajv = new Ajv()

interface BlogPost {
  _id: string;
  blog_id: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: {
    user_id: string,
    profile_img: string,
    fullname: string,
    email: string,
    username: string
  };
  draft: boolean;
}

const BlogSchema = ajv.compile({
  type: "object",
  properties: {
    _id: { type: "string" },
    blog_id: { type: "string" },
    title: { type: "string" },
    banner: { type: "string" },
    content: { type: "string" },
    tags: { type: "array" },
    des: { type: "string" },
    author: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        profile_img: { type: "string" },
        fullname: { type: "string" },
        email: { type: "string" },
        username: { type: "string" }
      }
    },
    draft: { type: "boolean" }
  },
  required: ['author', 'title'],
  additionalProperties: false
})

export const saveDraft = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    return res.status(400).json({ msg: "The payload is invalid" })
  }
  const { title, banner, content, tags, des, author, draft } = req.body as BlogPost
  const blogAuthor = await User.findById(req.session.user?.user_id)
  if (!blogAuthor) {
    return res.status(400).json({ message: "User does not exist in database" })
  }
  const drafts = await Blog.find({ author: blogAuthor, draft: true }).select('blog_id title banner content tags des draft').exec()
  console.log("drafts length: ", drafts.length)
  if (drafts.length >= 5) {
    return res.status(400).json("Draft limit reached, maximum is 5.")
  }
  let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
  const newBlog = new Blog({
    title, banner, content, tags, des, author: blogAuthor?._id, blog_id, draft: Boolean(draft)
  })
  await newBlog.save()
  res.status(200).json(newBlog._id)
}

export const getDrafts = async (req: Request, res: Response) => {
  const user = await User.findById(req.session.user?.user_id)
  const drafts = await Blog.find({ author: user, draft: true }).select('blog_id title banner content tags des draft').exec()
  if (!drafts) {
    return res.status(200).json({ draft: 0 })
  }
  const author = formatUserData(user!)
  const draftsWithAuthor = drafts.map((draft) => {
    return { ...draft.toObject(), author }
  })
  res.status(200).json(draftsWithAuthor)
}

export const updateDraft = async (req: Request, res: Response) => {
  const user = await User.findById(req.session.user?.user_id)
  const { _id, blog_id, title, banner, content, tags, des, author, draft } = req.body as BlogPost
  console.log("Below is from update controller")
  if (user?._id.toString() !== author.user_id) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not authorized to update this blog post")
  }
  const updatedBlog = await Blog.updateOne({blog_id}, {title, banner, content, tags, des})
  console.log(updatedBlog)
    res.status(200).json("Success")
}