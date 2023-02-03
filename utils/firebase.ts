import { getAuth } from "firebase-admin/auth";
import admin from "../services/firebase";
import { getUserData } from "./neo4j";

export const phoneNumberExists = async (phoneNumber: string) =>
  await getAuth(admin).getUserByPhoneNumber(phoneNumber);

export const emailExists = async (email) =>
  await getAuth(admin).getUserByEmail(email);

export const getUsersByContacts = async (
  contacts: string[],
  currUid: string
) => {
  const users = [];
  for await (let contact of contacts) {
    try {
      contact = contact.trim().replace(/ /g, "");
      if (contact.length !== 13 || !contact.startsWith("+")) {
        if (contact.length === 10) contact = "+91" + contact;
        else if (contact.length === 12) contact = "+" + contact;
      }
      const { uid } = await phoneNumberExists(contact);
      if (currUid !== uid) {
        // console.log("🚀 ~ file: firebase.ts:20 ~ contacts.forEach ~ uid", uid);
        const actualUser = await getUserData(uid);
        if (actualUser) users.push(actualUser);
      }
    } catch (error) {
      // console.log("🚀 ~ file: firebase.ts:30 ~ forawait ~ error", error);
      if (error.code === "auth/user-not-found") continue;
    }
  }
  // console.log("🚀 ~ file: firebase.ts:13 ~ getUsersByContacts ~ users", users);
  return users;
};
