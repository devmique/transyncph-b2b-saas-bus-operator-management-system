import { MongoClient, Db } from 'mongodb';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();

  const db = client.db('transync_ph');
  //  ensure indexes once on first connection
  await db.collection('operators').createIndex({ email: 1 }, { unique: true });

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}
