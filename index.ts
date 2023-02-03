import express, { Application } from "express";
import User from "./routes/User";
import Friends from "./routes/Friends";
import firebase from "./services/firebase";
import db from "./services/neo4j";
import neo4j from "neo4j-driver";
// import db from "./services/neo4j";

const app: Application = express();

// console.log(db);

app.use(express.json());
app.use("/api/user", User);
app.use("/api/friends", Friends);

app.listen(3000, () => console.log("server is running"));
