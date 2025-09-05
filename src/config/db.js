const mongoose = require("mongoose");

// const URI = "mongodb://127.0.0.1:27017/first_mern";
const URI = process.env.MONGODB_URI;

// mongoose.connect(URI)

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected successfully!...");
  } catch (error) {
    console.error("db faild to connect...");
  }
};

module.exports = connectDB;

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
