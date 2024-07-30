const User = require("../Models/User")
const mongoose = require("mongoose");
const Connection = async () => {
    // const URL = "mongodb://127.0.0.1:27017/Puneet";
    const URL = "mongodb+srv://triprabhat__001:nXDTCmoV8gNammwq@quiz-app.tckswf5.mongodb.net";
    try {
        const db = await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database', error);
    }
}

module.exports = Connection;