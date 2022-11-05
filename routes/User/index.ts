import express, { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import authMiddleware from "../../middleware/auth";
import admin from "../../services/firebase";
import {
  checkUsernameValidity,
  getUserData,
  setUserData,
} from "../../utils/rtdb";
const router = express.Router();

// router.use(authMiddleware);
router.route("/").post(async (req: Request, res: Response) => {
  const { user } = req.body;
  try {
    const actualUser = await setUserData(user);
    res.json({ user: actualUser });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.route("/usernameValid").post(async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const valid = await checkUsernameValidity(username);
    res.json({ valid });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.route("/").get(async (req: Request, res: Response) => {
  const { uid } = req.query;
  // console.log("🚀 ~ file: index.ts ~ line 33 ~ router.route ~ uid", uid)
  try {
    //@ts-ignore
    const actualUser = await getUserData(uid);
    res.json({ user: actualUser });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.route("/phoneValid").post(async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    console.log(
      "🚀 ~ file: index.ts ~ line 15 ~ router.route ~ phoneNumber",
      phoneNumber
    );
    const resp = await getAuth(admin).getUserByPhoneNumber(phoneNumber);
    console.log(
      "🚀 ~ file: index.ts ~ line 17 ~ router.route ~ resp",
      Boolean(resp)
    );
    return res.json({ valid: true });
  } catch (e) {
    const { code } = e;
    if (code === "auth/user-not-found") {
      return res.json({ valid: false });
    }
    res.status(500).send(e);
  }
});

export default router;
