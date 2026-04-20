import 'dotenv/config';

import mongoose from 'mongoose';
import { startHttpApi } from '../app';

//should this be refactored into a different file?
const connectMongoDb = async () => {
  const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
  console.log(url);
  console.log('Connecting to mongodb...');
  await mongoose.connect(url);
  console.log('mongodb connected =)');
};

const executeApp = async () => {
  try {
    await connectMongoDb();
    startHttpApi();
  } catch (error) {
    console.log('unable to start application: ', error);
    process.exit(1);
  }
};

void executeApp();
