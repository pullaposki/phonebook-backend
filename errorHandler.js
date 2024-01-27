const errorHandler = (error, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.status) {
    return response.status(error.status).send({ error: error.message });
  }

  // This line is used to pass the error to the next error handling middleware in the stack.
  // If there is no next error handling middleware, Express will automatically send a 500 response.
  next(error);
};

const unknownEndpoint = (response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

exports.errorHandler = errorHandler;
exports.unknownEndpoint = unknownEndpoint;
