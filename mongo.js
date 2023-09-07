const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Not enough arguments');
    process.exit(1);
}

const password = process.argv[2];
const dbName = 'phonebookApp';
const url = `mongodb+srv://mdelmas93:${password}@cluster0.eqodv2c.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook:");
        result.forEach(person => console.log(person));
        mongoose.connection.close();
    });
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`, result);
        mongoose.connection.close();
    });
}

