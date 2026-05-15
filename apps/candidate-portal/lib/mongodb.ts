import { MongoClient } from "mongodb";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (!client) {
    client = new MongoClient(uri, {});
    clientPromise = client.connect();
  }
  return clientPromise!;
}

export async function getDatabase(dbName: string = "rassa") {
  const client = await getClient();
  return client.db(dbName);
}

export default getClient;
