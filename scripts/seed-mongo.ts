import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/rassa-saas";

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Seed companies
  await db.collection("companies").insertMany([
    { name: "Acme Corp", slug: "acme", createdAt: new Date() },
    { name: "Globex Inc", slug: "globex", createdAt: new Date() },
  ]);

  // Seed users
  await db.collection("users").insertMany([
    { email: "admin@rassa.local", role: "admin", createdAt: new Date() },
    { email: "candidate@rassa.local", role: "candidate", createdAt: new Date() },
    { email: "recruiter@rassa.local", role: "recruiter", createdAt: new Date() },
  ]);

  console.log("Seeded MongoDB");
  await client.close();
}

seed().catch(console.error);
