import { Router } from "express";
import { deleteDraft, getDrafts, saveDraft, updateDraft } from "../controllers/editorControllers";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAuthor } from "../middlewares/isAuthor";

const editorRoutes = Router()

editorRoutes.route('/draft')
  .post(isAuthenticated, saveDraft)
  .get(isAuthenticated, getDrafts)
  .put(isAuthenticated, isAuthor, updateDraft)
  .delete(isAuthenticated, isAuthor, deleteDraft)

export default editorRoutes