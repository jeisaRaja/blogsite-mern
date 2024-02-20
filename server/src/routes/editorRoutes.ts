import { Router } from "express";
import { getDrafts, saveDraft } from "../controllers/editorControllers";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const editorRoutes = Router()

editorRoutes.route('/draft')
  .post(isAuthenticated, saveDraft)
  .get(isAuthenticated, getDrafts)

export default editorRoutes