import { Router } from 'express'
import { googleAuth, isSignedIn, signIn, signOut, signUp } from '../controllers/authControllers'
import { isAuthenticated } from '../middlewares/isAuthenticated'


const authRoutes = Router()

authRoutes.route('/session')
  .get(isAuthenticated, isSignedIn)

authRoutes.route('/signin')
  .post(signIn)

authRoutes.route('/signup')
  .post(signUp)

authRoutes.route('/signout').post(signOut)

authRoutes.route('/google-auth')
  .post(googleAuth)

export { authRoutes }

