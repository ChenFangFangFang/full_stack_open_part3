const mongoose = require('mongoose')
const Phonebook = require('./models/phonebook')

const url = process.env.MONGODB_URI
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
mongoose.connect(url)
mongoose.set('strictQuery', false)

console.log('connecting to', url)

if (process.argv.length === 3) {
  Phonebook.find({}).then(result => {
    console.log('phonebook:')

    result.forEach(person => {
      console.log(`${person.name.padEnd(20)} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
} else if (process.argv.length === 5) {
  const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })

  Phonebook.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
    process.exit(1)
  })
}