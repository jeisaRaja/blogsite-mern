import { Request, Response, NextFunction } from "express"
import 'dotenv/config'
import User from "../Schema/User"
import { formatUserData } from "../utils/formatUserData"
import { nanoid } from "nanoid"

interface JwtPayload {
  id: string
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.session.user)
    if (!req.session.user) {
      return res.status(400).json({ message: "Please sign in again" })
    }
    const id = req.session.user.user_id
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ message: "Account not found" })
    }
    next()
  } catch (e) {
    console.error('Error checking signed-in status:', e);
    res.status(500).json({ message: "Internal server error" });
  }
}
