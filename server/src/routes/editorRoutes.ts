import { Router } from "express";
import { deleteDraft, getDrafts, saveDraft, updateDraft } from "../controllers/editorControllers";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const editorRoutes = Router()

editorRoutes.route('/draft')
  .post(isAuthenticated, saveDraft)
  .get(isAuthenticated, getDrafts)
  .put(isAuthenticated, updateDraft)
  .delete(isAuthenticated, deleteDraft)

export default editorRoutes