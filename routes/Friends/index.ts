import express, { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import authMiddleware from "../../middleware/auth";
import admin from "../../services/firebase";
import {
  emailExists,
  getUsersByContacts,
  phoneNumberExists,
} from "../../utils/firebase";
import {
  checkUsernameValidity,
  getUserData,
  getUserFriends,
  setUserData,
  updateUserData,
  getFriendSuggestions,
  addFriend,
  getMetaData,
} from "../../utils/neo4j";
const router = express.Router();

router.use(authMiddleware);

router.route("/").get(async (req: Request, res: Response) => {
  // const { uid } = req.query;
  console.log(
    "🚀 ~ file: index.ts ~ line 33 ~ router.route ~ uid",
    req.headers.authtoken
  );
  try {
    //@ts-ignore
    const friends = await getUserFriends(req.headers.uid);
    console.log(
      "🚀 ~ file: index.ts:26 ~ router.route ~ req.headers.uid",
      req.headers.uid
    );
    console.log("🚀 ~ file: index.ts:26 ~ router.route ~ friends", friends);
    res.json({ friends });
  } catch (error) {
    console.log("🚀 ~ file: index.ts:27 ~ router.route ~ error", error);
    res.status(500).send(error);
  }
});

router.route("/suggestions").get(async (req: Request, res: Response) => {
  // const { uid } = req.query;
  console.log(
    "🚀 ~ file: index.ts ~ line 33 ~ router.route ~ uid",
    req.headers.authtoken
  );
  try {
    //@ts-ignore
    const suggestions = await getFriendSuggestions(req.headers.uid);
    console.log(
      "🚀 ~ file: index.ts:26 ~ router.route ~ suggestions",
      suggestions
    );
    res.json({ suggestions });
  } catch (error) {
    console.log("🚀 ~ file: index.ts:27 ~ router.route ~ error", error);
    res.status(500).send(error);
  }
});

router.route("/contacts").get(async (req: Request, res: Response) => {
  let { contacts } = req.query;
  console.log("🚀 ~ file: index.ts:44 ~ router.route ~ contacts", contacts);
  //@ts-ignore
  contacts = JSON.parse(contacts);
  try {
    //@ts-ignore
    const suggestions = await getUsersByContacts(contacts, req.headers.uid);
    console.log(
      "🚀 ~ file: index.ts:51 ~ router.route ~ suggestions",
      suggestions
    );
    res.json({ suggestions });
  } catch (error) {
    console.log(
      "🚀 ~ file: index.ts:27 ~ router.route ~ error",
      error,
      error.code
    );
    // if (error.code === "auth/user-not-found") {
    //   return res.json({ suggestions: [] });
    // }
    res.status(500).send(error);
  }
});

router.route("/add").post(async (req: Request, res: Response) => {
  let { friendUid } = req.body;
  try {
    //@ts-ignore
    const response = await addFriend(req.headers.uid, friendUid);
    res.json({ added: response });
  } catch (error) {
    console.log("🚀 ~ file: index.ts:27 ~ router.route ~ error", error);
    res.status(500).send(error);
  }
});

router.route("/meta").get(async (req: Request, res: Response) => {
  let { friendUid } = req.query;
  try {
    //@ts-ignore
    const response = await getMetaData(req.headers.uid, friendUid);
    res.json({ relation: response });
  } catch (error) {
    console.log("🚀 ~ file: index.ts:27 ~ router.route ~ error", error);
    res.status(500).send(error);
  }
});

export default router;
