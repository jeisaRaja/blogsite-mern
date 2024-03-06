import { Router } from "express";
import { getAllBlogs } from "../controllers/blogController";

const blogsRouter = Router()

blogsRouter.route('/').get(getAllBlogs)
export default blogsRouter