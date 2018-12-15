const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'));
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
    res.send('<p>puhelinluettelossa '+persons.length+' henkilön tiedot</p></br>'+new Date().toUTCString())
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
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    }
    const contains = persons.filter(person => person.name === body.name)
    if(contains.length !== 0){
        return response.status(400).json({error: 'name must be unique'})
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

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`)
})