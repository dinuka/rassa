import { MongoClient } from "mongodb";

import env from "./env";

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export const getClient = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(env.mongodbUri, {});
    clientPromise = client.connect();
  }
  return clientPromise!;
};

export const getDatabase = async (dbName: string = "rassa") => {
  const c = await getClient();
  return c.db(dbName);
};
