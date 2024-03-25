import { NextFunction, Request, Response } from "express";
import { BlogPost } from "../controllers/editorControllers";
import Blog from "../Schema/Blog";

export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.body as BlogPost
  const blog = await Blog.findById(_id)
  if (req.session.user?._id.toString() !== blog?.author._id.toString()) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not the author this blog post")
  }
  next()
}