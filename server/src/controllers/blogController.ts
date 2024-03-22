import { Request, Response } from "express";
import Blog from "../Schema/Blog";

// Get All Published Blog
export const getRecentBlogs = async (req: Request, res: Response) => {
  const publishedBlogs = await Blog.find({ draft: false }).populate({
    path: "author",
    select: "personal_info.fullname personal_info.email personal_info.profile_img"
  })
  const recentBlogs = publishedBlogs.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  res.status(200).json(recentBlogs)
}

// /all/blogs
// /category/blogs

// Get One Blog Details

// Get Blogs by filter
