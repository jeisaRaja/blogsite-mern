import server from "./server";
import mongoose from "mongoose";

const connectionString: string = process.env.DB_STRING || '';

mongoose.connect(connectionString, {
  autoIndex: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

server.listen(process.env.PORT, () => {
  console.log(`Listening to PORT -> ${process.env.PORT}`);
});