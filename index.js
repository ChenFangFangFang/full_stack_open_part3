const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
app.use(morgan('tiny'));
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
let phonebooks = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// Routes
app.get("/api/persons",(request, response) => {
    response.json(phonebooks)
})
app.get("/info",(request, response) => {
    const num = phonebooks.length
    const currentDate = new Date()
    const message =  `
    <p>Phonebook has info for ${num} people
    <p>${currentDate}
    `
    response.send(message)
})

app.get("/api/persons/:id",(request, response) => {
    const id = request.params.id
    const phonebook = phonebooks.find(phonebook => phonebook.id === id)
    if (phonebook){
        response.json(phonebook)
    }
    else{
        response.status(404).end()
    }})
app.delete("/api/persons/:id",(request,response)=> {
    const id = request.params.id
    phonebooks = phonebooks.filter(phonebook => phonebook.id !==id)
    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000)); 
  }

app.post("/api/persons",(request, response) => {
    const body = request.body
    console.log(JSON.stringify(body, null, 2)) // Log the body as a JSON string

    if(!body.name || !body.number){
      return response.status(400).json({
        error:'name or number missing'
      })
    }
    
    if (phonebooks.find(phonebook => phonebook.name === body.name)) { // Use find to check for duplicates without assignment
        return response.status(400).json({
            error:'name must be unique'
          })
    }
    const phonebook = {
      name: body.name,
      number:body.number,
      id:generateId()}
    phonebooks = phonebooks.concat(phonebook)
    response.json(phonebook)
})
// Use unknown endpoint middleware last
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})