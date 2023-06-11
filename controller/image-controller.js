import mongoose from 'mongoose';

const url = 'https://blogit-backend-s19u.onrender.com';

let gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs',
    });
});

export const uploadImage = (request, response) => {
    if (!request.file) return response.status(404).json('File not found');

    const imageUrl = `${url}/file/${request.file.filename}`;

    response.status(200).json(imageUrl);
};

export const getImage = (request, response) => {
    const downloadStream = gridfsBucket.openDownloadStreamByName(request.params.filename);
    downloadStream.pipe(response);
};
