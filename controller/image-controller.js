import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { GridFSBucket } from 'mongodb'; // Import GridFSBucket

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const url = " https://copper-swallow-fez.cyclic.cloud ";
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

export const uploadImage = async (request, response) => {
    if (!request.file) return response.status(404).json('File not found');

    try {
        const result = await cloudinary.v2.uploader.upload(request.file.path);

        const imageUrl = result.secure_url;

        response.status(200).json(imageUrl);
    } catch (error) {
        response.status(500).json('Image upload failed');
    }
};

export const getImage = (request, response) => {
    const { filename } = request.params;

    const downloadStream = gridfsBucket.openDownloadStreamByName(filename);

    // Set cache control headers to enable browser caching
    response.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year

    downloadStream.pipe(response);
};
