import { Router } from "express";
import { getRecentBlogs } from "../controllers/blogController";

const blogsRouter = Router()

blogsRouter.route('/')
  .get(getRecentBlogs)
export default blogsRouter