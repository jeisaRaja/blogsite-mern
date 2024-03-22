import { Router } from "express";
import { getOneBlog, getRecentBlogs } from "../controllers/blogController";

const blogsRouter = Router()

blogsRouter.route('/')
  .get(getRecentBlogs)

blogsRouter.route('/id/:blogId')
  .get(getOneBlog)

export default blogsRouter