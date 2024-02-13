import { Router } from 'express'
import { googleAuth, signIn, signUp } from '../controllers/authControllers'


const authRoutes = Router()

authRoutes.route('/signin')
  .post(signIn)

authRoutes.route('/signup')
  .post(signUp)

authRoutes.route('/google-auth')
  .post(googleAuth)

export { authRoutes }

