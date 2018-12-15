const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'));
app.use(cors())

let persons = [
  {name: "Arto Hellas",
    number: "040-123456",
    id: 1},
    {name: "Martti Tienari",
    number: "040-123456",
    id: 2},
    {name: "Arto Järvinen",
    number: "040-123456",
    id: 3},
    {name: "Lea Kutvonen",
    number: "040-123456",
    id: 4}
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req,res) =>{
    res.send('<p>puhelinluettelossa '+persons.length+' henkilön tiedot</p></br>'+new Date().toUTCString())
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random()*10000)
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`)
})