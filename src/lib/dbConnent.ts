import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected To database");
    return;
  }

  try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
        console.log(db);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected successfuly");

  } catch (error: any) {

        console.log("Database connection fail ", error.message);
        process.exit(1);

  }
};

export default dbConnect