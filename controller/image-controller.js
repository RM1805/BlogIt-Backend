import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const url = 'https://blogit-backend-s19u.onrender.com';
const dbUrl = `mongodb+srv://${username}:${password}@cluster0.qj0tyeo.mongodb.net/?retryWrites=true&w=majority`;

let gridfsBucket;

// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new GridFSBucket(conn.db, {
        bucketName: 'fs',
    });
});

export const uploadImage = (request, response) => {
    if (!request.file) return response.status(404).json('File not found');

    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);
};

export const getImage = (request, response) => {
    const { filename } = request.params;

    const downloadStream = gridfsBucket.openDownloadStreamByName(filename);

    // Set cache control headers to enable browser caching
    response.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year

    downloadStream.pipe(response);
};
