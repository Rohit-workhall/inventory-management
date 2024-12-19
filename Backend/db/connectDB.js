const mongoose = require('mongoose');

DB_URL = 'mongodb://127.0.0.1:27017/Inventory_Management'
const connectDB = async () => {
    try 
    {
        const connect = await mongoose.connect(DB_URL);
        console.log('DB connected :', connect.connection.name);
    } 
    catch (error) 
    {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
