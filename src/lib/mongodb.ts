import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially during
 * API Route usage.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    lastConnectTime: number;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null, lastConnectTime: 0 };

if (!global.mongoose) {
    global.mongoose = cached;
}

const CONNECTION_TIMEOUT = 8000; // 8 seconds

async function dbConnect(): Promise<typeof mongoose> {
    // If we have an active connection, return it
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If connection is disconnected/failed, reset
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        cached.conn = null;
        cached.promise = null;
    }

    // If there's no promise or the previous one failed, create a new connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 8000,
            socketTimeoutMS: 45000,
        };

        console.log("Connecting to MongoDB...");

        // Create a timeout wrapper
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('MongoDB connection timeout')), CONNECTION_TIMEOUT);
        });

        const connectPromise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB Connected Successfully");
            return mongoose;
        });

        cached.promise = Promise.race([connectPromise, timeoutPromise]).catch((err) => {
            console.error("MongoDB Connection Error:", err.message);
            cached.promise = null;
            cached.conn = null;
            throw err;
        }) as Promise<typeof mongoose>;
    }

    try {
        cached.conn = await cached.promise;
        cached.lastConnectTime = Date.now();
    } catch (e: any) {
        cached.promise = null;
        cached.conn = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
