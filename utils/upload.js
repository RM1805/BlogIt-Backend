import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const mongoURI = `mongodb+srv://${username}:${password}@cluster0.qj0tyeo.mongodb.net/?retryWrites=true&w=majority`;

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-blog-${file.originalname}`;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        };
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (request, file, callback) => {
        const match = ["image/png", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            callback(new Error('Invalid file type'));
        } else {
            callback(null, true);
        }
    }
});

export default upload;
