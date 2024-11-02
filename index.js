require('dotenv').config()
const Phonebook = require('./models/phonebook')
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const app = express()

app.use(morgan('tiny'));
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(requestLogger)

// Routes
app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })

})
app.get("/info", (request, response) => {
  Phonebook.countDocuments({}).then(count => {
    const currentDate = new Date();
    const message = `
          <p>Phonebook has info for ${count} people</p>
          <p>${currentDate}</p>
      `;
    response.send(message);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(request => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  })
  phonebook.save().then(savePhonebook => {
    response.json(savePhonebook)
  })
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const phonebook = {
    name: body.name,
    number: body.number,
  }
  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true, runValidators: true, context: 'query' })
    .then(updatePhonebook => {
      response.json(updatePhonebook)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
// Use unknown endpoint middleware last
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})