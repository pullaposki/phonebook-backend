const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const morgan = require('morgan');
const {response} = require("express");
morgan.token('post_data', (req) => JSON.stringify(req.body));
const format = ':method :url :status :res[content-length] - :response-time ms :post_data'
app.use(morgan(format));

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;

    Person.findById(id)
        .then(personDocument => {
            if(personDocument) {
                return Person.deleteOne({ _id: id });
            } else {
                return response.status(404).send({message: 'Person not found'});
            }
        }).then(() => {
        response.status(204).end();
    }).catch(err => {
        response.status(500).send({message: 'An error occurred', error: err.message});
    });
});

app.post("/api/persons/", (request, response)=>{
    const body = request.body;


    // Check if body.name and body.number exist before checking their lengths
    if (!body.name || !body.number || body.name.length === 0 || body.number.length === 0) {
        return response.status(400).json({ error: 'insufficient info given' });
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    // Add catch block to handle errors
    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => {
            response.status(500).json({ error: 'Failed to save new person. ' + error.message });
        });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0",
    () => console.log(`App is listening on port ${PORT}`)); 

