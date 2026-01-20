const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection

db.on('connected',()=>{console.log('MongoDB is connected')})
db.on('error',()=>{console.log('MongoDB connection errOR')})
db.on('disconnected',()=>{console.log('MongoDB is didconnected')})
module.exports = db











// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("DB connection failed", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;




