import mongoose from "mongoose";


const connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@cluster0.qj0tyeo.mongodb.net/?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(URL, {useNewUrlParser: true});
        console.log("Database connected successfully");
    } catch(error){
        console.log("failed to connect to the database", error);
    }
}

export default connection;