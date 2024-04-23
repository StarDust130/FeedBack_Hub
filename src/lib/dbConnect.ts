import mongoose from "mongoose";

type CoonectionObject = {
  isConnected?: number;
};

const connection: CoonectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connection to DB ✅");

    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("DB 💟", db);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected ✅");
  } catch (error) {
    console.log("DB Connection Error ❌", error);
    process.exit(1);
  }
};

export default dbConnect;

