import { getDatabase } from "firebase-admin/database";
import admin from "../services/firebase";
// import { AsyncStorage } from "react-native"

interface IUser {
  name: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profile_picture?: string | null;
  uid: string | null;
  username: string | null;
  createdAt?: string | null;
  coverImage?: string | null;
  age?: number | null;
}

export const setUserData = async (payload: IUser) => {
  console.log("🚀 ~ file: rtdb.ts ~ line 18 ~ setUserData ~ payload", payload);
  try {
    const dbRef = getDatabase(admin).ref();
    const userRef = dbRef.child("users/" + payload.uid);
    const usernameRef = dbRef.child(
      "username/" + payload.username?.toLowerCase().trim()
    );
    const response = await userRef.set({
      ...payload,
    });
    await usernameRef.set(payload.uid);

    // if (!payload.username)
    //   payload.username = `${payload.email?.split("@")[0]}${createdAt
    //     .split("T")[0]
    //     .split("-")
    //     .map((s) => s.slice(0, 2))
    //     .join("")}`;
    console.log(
      "🚀 ~ file: rtdb.ts ~ line 17 ~ payload.username=`${payload.email?.split ~ payload.username",
      payload
    );
    return {
      ...payload,
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateUserData = async (payload: Partial<IUser>) => {
  console.log("🚀 ~ file: rtdb.ts ~ line 18 ~ setUserData ~ payload", payload);
  try {
    const dbRef = getDatabase(admin).ref();
    const userRef = dbRef.child("users/" + payload.uid);
    const response = await userRef.update(payload);
    console.log(
      "🚀 ~ file: rtdb.ts ~ line 56 ~ updateUserData ~ response",
      response
    );
    // if (!payload.username)
    //   payload.username = `${payload.email?.split("@")[0]}${createdAt
    //     .split("T")[0]
    //     .split("-")
    //     .map((s) => s.slice(0, 2))
    //     .join("")}`;
    return {
      ...payload,
    };
  } catch (error) {
    console.error(error);
  }
};

export const checkUsernameValidity = async (username: string) => {
  try {
    const dbRef = getDatabase(admin).ref();
    const usernameRef = dbRef.child(
      "username/" + username?.toLowerCase().trim()
    );

    const response = await usernameRef.get();
    console.log(
      "🚀 ~ file: rtdb.ts ~ line 35 ~ checkUsernameValidity ~ response",
      response.exists()
    );
    if (response.exists()) {
      // console.log(response.val());
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (uid: string) => {
  console.log("🚀 ~ file: rtdb.ts ~ line 72 ~ getUserData ~ uid", uid);
  try {
    const dbRef = getDatabase(admin).ref();
    const userRef = dbRef.child("users/" + uid);
    const userPromise = await userRef.get();
    if (userPromise.exists()) {
      // console.log(userPromise.val());
      return userPromise.val();
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserFriends = async (uid: string) => {
  // console.log("🚀 ~ file: rtdb.ts ~ line 72 ~ getUserData ~ uid", uid);
  try {
    const dbRef = getDatabase(admin).ref();
    const userRef = dbRef.child("friends/" + uid);
    const userPromise = await userRef.get();
    if (userPromise.exists()) {
      // console.log(userPromise.val());
      return userPromise.val();
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
