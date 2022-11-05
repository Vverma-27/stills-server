import express, { Application } from "express";
import User from "./routes/User";
import firebase from "./services/firebase";

const app: Application = express();

console.log(firebase);

app.use(express.json());
app.use("/api/user", User);

app.listen(3000, () => console.log("server is running"));
