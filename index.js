import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

// Components
import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Router);

// Load environment variables from .env file
const PORT = process.env.PORT || 5000;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Establish the database connection
Connection(DB_USERNAME, DB_PASSWORD);

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
