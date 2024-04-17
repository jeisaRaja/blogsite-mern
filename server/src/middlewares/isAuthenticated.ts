import { Request, Response, NextFunction } from "express"

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      return res.status(400).json({ message: "Please sign in again" })
    }
    next()
  } catch (e) {
    console.error('Error checking signed-in status:', e);
    res.status(500).json({ message: "Internal server error" });
  }
}
