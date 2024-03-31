const mongoose = require("mongoose");

const connectdatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("connected");
    
  } catch (error) {
    console.log("config Failed" + error.message, error);
  }
};
module.exports = connectdatabase;
