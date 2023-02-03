import { getDatabase } from "firebase-admin/database";
import { isPrimitive } from "util";
import admin from "../services/firebase";
import db from "../services/neo4j";
// import { AsyncStorage } from "react-native"

export enum FriendRelations {
  FRIENDS = "FRIENDS",
  REQUESTED = "REQUESTED",
  BLOCKED = "BLOCKED",
  NO_RELATION = "NO_RELATION",
}

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

// Utility functions for user data

export const setUserData = async (payload: IUser) => {
  console.log("🚀 ~ file: neo4j.ts ~ line 18 ~ setUserData ~ payload", payload);
  try {
    const session = db.session();
    const result = await session.writeTransaction(async (txc) => {
      //   var params = {};
      //{userId: "johnsmith", email: "john@smith.com", ...}
      //   Object.keys(payload).forEach(function (k) {
      //     var value = payload[k];
      //     if (!isPrimitive(value)) value = JSON.stringify(value);
      //     params[k] = value;
      //   });
      const result = await txc.run(
        `CREATE (user:User) SET user=$payload RETURN user`,
        { payload }
      );
      return result.records.map((record) => record.get("user"));
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", result);
    session.close();
    return {
      ...payload,
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateUserData = async (payload: Partial<IUser>) => {
  try {
    const session = db.session();
    const result = await session.writeTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (p:User {uid:$payload.uid}) SET p+=$payload RETURN p`,
        { payload }
      );
      return result.records.map((record) => record.get("p"));
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", result);
    session.close();
    // const dbRef = getDatabase(admin).ref();
    // const userRef = dbRef.child("users/" + payload.uid);
    // const response = await userRef.update(payload);
    // console.log(
    //   "🚀 ~ file: neo4j.ts ~ line 56 ~ updateUserData ~ response",
    //   response
    // );
    return {
      ...payload,
    };
  } catch (error) {
    console.error(error);
  }
};

export const checkUsernameValidity = async (username: string) => {
  try {
    const session = db.session();
    const result = await session.readTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (p:User {username:$username}) RETURN p`,
        { username }
      );
      return result.records.map((record) => record.get("p"));
    });
    console.log("🚀 ~ file: neo4j.ts:69 ~ result ~ result", result);
    session.close();
    // const dbRef = getDatabase(admin).ref();
    // const usernameRef = dbRef.child(
    //   "username/" + username?.toLowerCase().trim()
    // );

    // const response = await usernameRef.get();
    // console.log(
    //   "🚀 ~ file: neo4j.ts ~ line 35 ~ checkUsernameValidity ~ response",
    //   response.exists()
    // );
    if (result.length !== 0) {
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
  console.log("🚀 ~ file: neo4j.ts ~ line 72 ~ getUserData ~ uid", uid);
  try {
    const session = db.session();
    const user = await session.readTransaction(async (txc) => {
      const result = await txc.run(`MATCH (p:User {uid:'${uid}'}) RETURN p`);
      console.log("🚀 ~ file: neo4j.ts:113 ~ user ~ result", result);
      return result.records[0].get("p");
    });
    console.log("🚀 ~ file: neo4j.ts:115 ~ user ~ user", user);
    session.close();
    // const dbRef = getDatabase(admin).ref();
    // const userRef = dbRef.child("users/" + uid);
    // const userPromise = await userRef.get();
    return user.properties;
  } catch (error) {
    console.log(error);
  }
};

// Utility functions for friends data

export const getMetaData = async (uid: string, friendUid: string) => {
  try {
    const session = db.session();
    const relation = await session.readTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (p:User {uid:$uid})-[r]->(y:User {uid:$friendUid}) RETURN r`,
        { uid, friendUid }
      );
      return result.records.map((record) => record.get("r"));
    });
    relation.map((rel) => {
      rel.type === FriendRelations.FRIENDS;
    });
    return relation[0].properties;
  } catch (error) {
    console.log(error);
  }
};

export const getUserFriends = async (uid: string) => {
  try {
    const session = db.session();
    const friends = await session.readTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (p:User {uid:$uid})-[:IS_FRIENDS]->(friend:User) RETURN friend`,
        { uid }
      );
      return result.records.map((record) => record.get("friend").properties);
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", friends);
    // session.close();
    // const dbRef = getDatabase(admin).ref();
    // const userRef = dbRef.child("friends/" + uid);
    // const userPromise = await userRef.get();
    return friends;
  } catch (error) {
    console.log(error);
  }
};

export const getFriendSuggestions = async (uid: string) => {
  try {
    const session = db.session();
    const friends = await session.readTransaction(async (txc) => {
      var result = await txc.run(
        `MATCH (u1:User {uid:$uid})-[:IS_FRIENDS]->(u2:User)-[:IS_FRIENDS]->(u3:User)
WHERE NOT (u1)-[:IS_FRIENDS]->(u3) AND NOT (u1)-[:REQUESTED]-(u3) AND u1.uid <> u3.uid
RETURN u3
LIMIT 15
`,
        { uid }
      );
      console.log(
        "🚀 ~ file: neo4j.ts:190 ~ friends ~ result",
        result.records[0]
      );
      var result2 = await txc.run(
        `MATCH (u1:User {uid:$uid}),(u3:User)
WHERE NOT (u1)-[:IS_FRIENDS]->(u3) AND u1.uid <> u3.uid AND NOT (u1)-[:REQUESTED]-(u3)
RETURN u3
LIMIT 15
`,
        { uid }
      );
      console.log(
        "🚀 ~ file: neo4j.ts:199 ~ friends ~ result2",
        result2.records[0]
      );
      return [...result.records, ...result2.records]
        .slice(0, 15)
        .map((record) => record.get("u3").properties);
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", friends);
    return friends;
  } catch (error) {
    console.log(error);
  }
};

export const addFriend = async (uid: string, friendUid: string) => {
  try {
    const session = db.session();
    const res = await session.writeTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (u1:User {uid:$uid}),(u2:User {uid:$friendUid})
WHERE NOT (u1)-[:IS_FRIENDS]-(u2)
CREATE (u1)-[r:REQUESTED]->(u2)
RETURN r
`,
        { uid, friendUid }
      );
      return result.records.map((record) => record.get("r"));
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", res);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const acceptFriend = async (uid: string, friendUid: string) => {
  try {
    const session = db.session();
    const res = await session.writeTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (u1:User {uid:$uid}),(u2:User {uid:$friendUid})
WHERE NOT (u1)-[:IS_FRIENDS]-(u2) AND (u1)-[r:REQUESTED]->(u2)
DELETE r
CREATE (u1)-[:IS_FRIENDS {since:timestamp()}]->(u2)
CREATE (u2)-[:IS_FRIENDS {since:timestamp()}]->(u1)
`,
        { uid, friendUid }
      );
      return result.records.map((record) => record.get("r"));
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", res);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const rejectFriend = async (uid: string, friendUid: string) => {
  try {
    const session = db.session();
    const res = await session.writeTransaction(async (txc) => {
      const result = await txc.run(
        `MATCH (u1:User {uid:$uid}),(u2:User {uid:$friendUid})
WHERE NOT (u1)-[:IS_FRIENDS]-(u2) AND (u1)-[r:REQUESTED]->(u2)
DELETE r
`,
        { uid, friendUid }
      );
      return result.records.map((record) => record.get("r"));
    });
    console.log("🚀 ~ file: neo4j.ts:25 ~ result ~ result", res);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
