import { Request, Response } from "express";
import Blog from "../Schema/Blog";

// Get All Published Blog
export const getAllBlogs = async (req: Request, res: Response) => {
  const publishedBlogs = await Blog.find({ draft: false })
  console.log(publishedBlogs)
  res.status(200).json(publishedBlogs)
}


// Get One Blog Details

// Get Blogs by filter
