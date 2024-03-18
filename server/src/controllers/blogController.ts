import { Request, Response } from "express";
import Blog from "../Schema/Blog";

// Get All Published Blog
export const getRecentBlogs = async (req: Request, res: Response) => {
  const publishedBlogs = await Blog.find({ draft: false }).populate({
    path: "author",
    select: "personal_info.fullname personal_info.profile_img"
  })
  console.log("api call in getRecentBlogs")
  res.status(200).json(publishedBlogs)
}

// /all/blogs
// /category/blogs

// Get One Blog Details

// Get Blogs by filter
