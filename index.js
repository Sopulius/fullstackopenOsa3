const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) =>{
  Person.countDocuments({}, function(err, count) {
    res.send('<p>puhelinluettelossa '+count+' henkilön tiedot</p></br>'+new Date().toUTCString())
  })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(formatPerson(person))
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
    
  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random()*10000)
  })
    
  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(savedPerson))
    })
   
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(formatPerson(updatedPerson))
    })
    .catch(() => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`)
})