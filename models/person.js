const mongoose = require('mongoose')

const url =process.env.MONGO_URI2;

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