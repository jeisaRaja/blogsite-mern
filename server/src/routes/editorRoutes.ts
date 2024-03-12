import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAuthor } from "../middlewares/isAuthor";
import { deleteBlog, getBlogs, publishBlog, saveBlog, updateBlog } from "../controllers/editorControllers";

const editorRoutes = Router()

editorRoutes.route('/')
  .post(isAuthenticated, saveBlog)
  .get(isAuthenticated, getBlogs)
  .put(isAuthenticated, isAuthor, updateBlog)
  .delete(isAuthenticated, isAuthor, deleteBlog)

editorRoutes.route('/publish')
  .post(isAuthenticated, publishBlog)
  .put(isAuthenticated, isAuthor, publishBlog)

export default editorRoutes