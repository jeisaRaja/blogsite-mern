import { Router } from "express";
import { addComment, getLike, getOneBlog, getRecentBlogs, toggleLikeBlog } from "../controllers/blogController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const blogsRouter = Router()

blogsRouter.route('/')
  .get(getRecentBlogs)

blogsRouter.route('/id/:blogId')
  .get(getOneBlog)

blogsRouter.route('/like/id/:blogId')
  .get(isAuthenticated, getLike)
  .post(isAuthenticated, toggleLikeBlog)

blogsRouter.route('/id/:blogId/comment')
  .post(isAuthenticated, addComment)

export default blogsRouter