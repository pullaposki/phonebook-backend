const mongoose = require("mongoose");

const mongo_url = process.env.MONGODB_URL;
//@
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url =
  "mongodb+srv://" +
  mongo_user +
  ":" +
  mongo_password +
  "@" +
  mongo_url +
  "/persons?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;    
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
