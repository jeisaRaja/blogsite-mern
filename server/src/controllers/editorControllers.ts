import { Request, Response } from "express";
import Blog from "../Schema/Blog";
import User from "../Schema/User";
import { nanoid } from "nanoid";
import Ajv from "ajv";
import { formatUserData } from "../utils/formatUserData";
import { auth } from "firebase-admin";

const ajv = new Ajv()

export interface BlogPost {
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
  required: ['author', 'title', 'banner', 'content'],
  additionalProperties: false
})

export const saveBlog = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    return res.status(400).json({ msg: "The payload is invalid" })
  }
  const { title, banner, content, tags, des, author, draft } = req.body as BlogPost
  const drafts = await Blog.find({ author: req.user, draft: true }).select('blog_id title banner content tags des draft').exec()
  if (drafts.length >= 4) {
    return res.status(400).json("Draft limit reached, maximum is 4.")
  }
  let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
  const newBlog = new Blog({
    title, banner, content, tags, des, author: req.user?._id, blog_id, draft: Boolean(draft)
  })
  await newBlog.save()
  res.status(200).json(newBlog._id)
}

export const getBlogs = async (req: Request, res: Response) => {
  const drafts = await Blog.find({ author: req.user, draft: true }).select('blog_id title banner content tags des draft').exec()
  if (!drafts) {
    return res.status(200).json({ draft: 0 })
  }
  const author = formatUserData(req.user!)
  const draftsWithAuthor = drafts.map((draft) => {
    return { ...draft.toObject(), author }
  })
  res.status(200).json(draftsWithAuthor)
}

export const updateBlog = async (req: Request, res: Response) => {
  const { _id, blog_id, title, banner, content, tags, des, author, draft } = req.body as BlogPost
  if (req.user?._id.toString() !== author.user_id) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not authorized to update this blog post")
  }
  const updatedBlog = await Blog.updateOne({ blog_id }, { title, banner, content, tags, des })
  res.status(200).json("Success")
}

const DeleteDraftSchema = ajv.compile({
  type: "object",
  properties: {
    _id: { type: "string" },
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
  },
  required: ['author', '_id'],
  additionalProperties: false
})

export const deleteBlog = async (req: Request, res: Response) => {
  console.log(req.body)
  const valid = DeleteDraftSchema(req.body)
  if (!valid) {
    return res.status(400).json("Invalid payload")
  }
  const deletedBlog = await Blog.findByIdAndDelete(req.body._id)
  console.log(deletedBlog)
  res.status(200).json("success")
}

export const publishBlog = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    return res.status(400).json("Request invalid")
  }
  const { _id, title, banner, content, tags, des } = req.body as BlogPost
  console.log(title)
  if (!_id) {
    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
    const newBlog = new Blog({
      title, banner, content, tags, des, author: req.user?._id, blog_id, draft: false
    })
    await newBlog.save()
    res.status(200).json(blog_id)
  }
  const blog = await Blog.findByIdAndUpdate(_id, { title, banner, content, tags, des, draft: false })
  if (!blog) {
    return res.status(400).json("blog doesn't exist")
  }
  res.status(200).json(blog.blog_id)
}