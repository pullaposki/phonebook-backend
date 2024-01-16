const mongoose = require('mongoose')
const password = process.env.MONGODB_PASSWORD;
const name = process.env.MONGODB_USER;
const mongo_url=process.env.MONGODB_URL;
const url =`mongodb+srv://${name}:${password}@${mongo_url}/persons?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name:String,
    number:Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id=returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
module.exports = mongoose.model("Person", personSchema);