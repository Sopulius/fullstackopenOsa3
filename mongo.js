const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = ''


mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

var i = 0
process.argv.forEach((val, index) => {
    i++
});

if(i === 4){
    var args = process.argv.slice(2)
    const person = new Person({
        name: args[0],
        number: args[1]
      })
      
      person
        .save()
        .then(response => {
          console.log('person saved!')
          mongoose.connection.close()
        })
}else if(i === 2){
    console.log("Puhelinluettelo:")
    Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}else{
    console.log("Error: Check the number of arguments.")
    mongoose.connection.close()
}

