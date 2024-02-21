import { Request, Response } from "express";
import Blog from "../Schema/Blog";
import User from "../Schema/User";
import { nanoid } from "nanoid";
import Ajv from "ajv";

const ajv = new Ajv()

interface BlogPost {
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: {
    username: string;
  };
  draft: boolean;
}

const BlogSchema = ajv.compile({
  type: "object",
  properties: {
    title: { type: "string" },
    banner: { type: "string" },
    content: { type: "string" },
    tags: { type: "array" },
    des: { type: "string" },
    author: {
      type: "object",
      properties: {
        username: { type: "string" }
      }
    },
    draft: { type: "boolean" }
  },
  required: ['author', 'title'],
  additionalProperties: true
})

export const saveDraft = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    console.log(valid)
    return res.status(400).json({ msg: "The payload is invalid" })
  }
  const { title, banner, content, tags, des, author, draft } = req.body as BlogPost
  const blogAuthor = await User.findOne({ "personal_info.username": author.username })
  let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
  console.log(draft)
  const newBlog = new Blog({
    title, banner, content, tags, des, author: blogAuthor?._id, blog_id, draft: Boolean(draft)
  })
  await newBlog.save()
  res.status(200).json(newBlog)
}

export const getDrafts = async (req: Request, res: Response) => {
  const user = await User.findById(req.session.user?.user_id)
  const drafts = await Blog.find({ author: user, draft: true }).select('blog_id title banner content tags des author draft').exec()
  console.log("drafts")
  if (!drafts) {
    return res.status(200).json({ draft: 0 })
  }
  res.status(200).json(drafts)
}