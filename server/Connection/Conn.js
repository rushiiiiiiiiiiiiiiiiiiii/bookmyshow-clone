const mongoose = require("mongoose");
require('dotenv').config()
console.log("Using DB:", process.env.MONGO_URL);

const Conn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoURL);
    console.log("Mongodb connected succesfully");
  } catch (err) {
    console.log(err);
  }
};
module.exports = Conn;
