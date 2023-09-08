const mongoose = require('mongoose');

mongoose.set('strictQuery',false)

console.log('Connecting to...', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log("Successfully connected!"))
    .catch(error => console.log("Error connecting to DB: ", error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
      },    
  
      number: {
        type: String,
        validate: {
            validator: function(v) {
              return /\d{2}-\d{6}/.test(v) || /\d{3}-\d{5}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },    
        required: [true, 'Phone number required']
      },    
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
    