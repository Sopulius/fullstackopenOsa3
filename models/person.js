const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = ''


mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person