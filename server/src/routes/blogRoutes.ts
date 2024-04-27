import { Router } from "express";
import { addComment, deleteComment, getBlogsByAuthor, getLike, getOneBlog, getRecentBlogs, toggleLikeBlog } from "../controllers/blogController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const blogsRouter = Router()

blogsRouter.route('/')
  .get(getRecentBlogs)

blogsRouter.route('/id/:blogId')
  .get(getOneBlog)

blogsRouter.route('/user/:user_id').get(getBlogsByAuthor)

blogsRouter.route('/id/:blogId/like')
  .get(isAuthenticated, getLike)
  .post(isAuthenticated, toggleLikeBlog)

blogsRouter.route('/id/:blogId/comment')
  .post(isAuthenticated, addComment)

blogsRouter.route('/id/:blogId/comment/:commentId')
  .delete(isAuthenticated, deleteComment)
export default blogsRouter
