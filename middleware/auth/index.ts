import Express, { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import admin from "../../services/firebase";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authtoken) {
    console.log(
      "🚀 ~ file: index.ts ~ line 6 ~ authMiddleware ~ req.headers.authtoken",
      req.headers.authtoken
    );
    getAuth(admin) //@ts-ignore
      .verifyIdToken(req.headers.authtoken, true)
      .then((decodedToken) => {
        const { uid } = decodedToken;
        req.headers.uid = uid;
        next();
      })
      .catch((e) => {
        console.log(e);
        res.status(403).send("Unauthorized");
      });
  } else {
    res.status(403).send("Unauthorized");
  }
};
export default authMiddleware;
