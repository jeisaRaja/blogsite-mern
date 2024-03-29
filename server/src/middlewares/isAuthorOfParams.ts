import { NextFunction, Request, Response } from "express"
import Blog from "../Schema/Blog"

export const isAuthorOfParams = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params
  const blog = await Blog.findOne({ blog_id: blogId })
  if (req.session.user?._id.toString() !== blog?.author._id.toString()) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not the author this blog post")
  }
  next()
}