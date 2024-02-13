import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import 'dotenv/config'

interface JwtPayload {
  id: string
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    const payload = jwt.verify(token!, process.env.JWT_PRIVATE!) as JwtPayload;
    console.log(payload)
    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}
