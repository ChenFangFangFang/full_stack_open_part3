const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];


mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (!name || !number) {
  Phonebook.find({})
    .then(result => {
      console.log('Phonebook entries:');
      result.forEach(entry => {
        console.log(`${entry.name} ${entry.number}`);
      });
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      mongoose.connection.close();
    });
} else {
  const phonebook = new Phonebook({
    name: name,
    number: number,
  });

  phonebook.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Error saving data:', error);
      mongoose.connection.close();
    });
}