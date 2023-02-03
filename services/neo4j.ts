import neo4j from "neo4j-driver";

// console.log(process.env);
const [username, password] = process.env.NEO4J_AUTH.split("/");
const db = neo4j.driver(
  "bolt://neo:7687",
  neo4j.auth.basic(username, password)
);
export default db;
