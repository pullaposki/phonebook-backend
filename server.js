const express = require("express");
const { errorHandler, unknownEndpoint } = require("./errorHandler");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// Morgan middleware
morgan.token("post_data", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :post_data";
app.use(morgan(format));

app.get("/", (response) => {
  response.send("<h1>Hello World!</h1>");
});

// GET all
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// GET by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

// DELETE
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((personDocument) => {
      if (personDocument) {
        return Person.deleteOne({ _id: id });
      } else {
        return response.status(404).send({ message: "Person not found" });
      }
    })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST
app.post("/api/persons/", (request, response, next) => {
  const body = request.body;

  if (nameAndNumberCheckNotPassed(body)) {
    return response.status(400).json({ error: "insufficient info given" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const theId = req.params.id;

  if (nameAndNumberCheckNotPassed(req.body)) {
    return response.status(400).json({ error: "insufficient info given" });
  }

  const newPersonInfo = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findOneAndUpdate({ _id: theId }, newPersonInfo, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// Error handling middleware
app.use(errorHandler);
app.use(unknownEndpoint);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`App is listening on port ${PORT}`)
);

// Helper functions
function nameAndNumberCheckNotPassed(body) {
  return (
    !body.name ||
    !body.number ||
    body.name.length === 0 ||
    body.number.length === 0
  );
}
