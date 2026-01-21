import type { UserDocument } from "../../models/user";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
      authToken?: string;
    }
  }
}

export { };
