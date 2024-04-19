import { Router } from "express";
import { updateUser } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const userRouter = Router()

userRouter.route('/').put(isAuthenticated, updateUser)

export default userRouter

