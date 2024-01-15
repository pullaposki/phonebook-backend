
// Import module to interact with MongoDB
const mongoose = require('mongoose')


// Check for command line argument as password
if (process.argv.length<3) {
  console.log('give password and name as arguments')
  process.exit(1)
}

// Extract arguments
const password = process.argv[2]


const connectToDb = () => {
  // Prepare MongoDB connection string with the password
  const url =
      `mongodb+srv://test:${password}@testiklusteri.bwokbqd.mongodb.net/persons?retryWrites=true&w=majority`

// Disabling strict mode for mongoose to ignore invalid fields in query
  mongoose.set('strictQuery', false)

// Connecting to MongoDB
  mongoose.connect(url)
}
const saveNewPerson = (name, number) => {
  // Define schema for Note collection, with string content and boolean importance
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

// Create a Note model using the schema
  const Person = mongoose.model('Person', personSchema)

// Create and save a new instance of Note, closing the connection afterwards
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log('person saved!', result)
    mongoose.connection.close()
  })
}
const printPersons = () => {
  // Define schema for Note collection, with string content and boolean importance
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

// Create a Note model using the schema
  const Person = mongoose.model('Person', personSchema)

  Person.find({})
      .then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(person.name +" "+ person.number)
        })
      })
        mongoose.connection.close()
      .then(()=>{
      })
}

if (process.argv.length > 3){
  console.log(process.argv)
  const name = process.argv[3]

  let number=0
  if (process.argv.length > 3) {
    number = process.argv[4]

  }
  connectToDb()
  saveNewPerson(name, number)
}else {
  connectToDb()
  printPersons()
}
