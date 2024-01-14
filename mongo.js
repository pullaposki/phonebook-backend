// Import module to interact with MongoDB
const mongoose = require('mongoose')

// Check for command line argument as password
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Extract password from command line argument
const password = process.argv[2]

// Prepare MongoDB connection string with the password
const url =
    `mongodb+srv://test:${password}@testiklusteri.bwokbqd.mongodb.net/noteApp?retryWrites=true&w=majority`

// Disabling strict mode for mongoose to ignore invalid fields in query
mongoose.set('strictQuery', false)
// Connecting to MongoDB
mongoose.connect(url)

// Define schema for Note collection, with string content and boolean importance
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Create a Note model using the schema
const Note = mongoose.model('Note', noteSchema)

// Create and save a new instance of Note, closing the connection afterwards
const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log(result)
  console.log('note saved!')
  mongoose.connection.close()
})