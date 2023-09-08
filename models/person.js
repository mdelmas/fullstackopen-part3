const mongoose = require('mongoose');

mongoose.set('strictQuery',false)

console.log('Connecting to...', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log("Successfully connected!"))
    .catch(error => console.log("Error connecting to DB: ", error.message))

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
    