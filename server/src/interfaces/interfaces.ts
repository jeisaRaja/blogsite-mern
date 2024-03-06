import { Session } from "express-session";
import { UserDocument, UserSession } from "../Schema/User";

export interface RequestUser extends Request {
  user?: UserDocument;
  session: Session & { user?: UserSession };
}