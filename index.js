require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const Person = require('./models/person');
const responseTime = require('response-time');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// app.use(morgan('tiny'));

// morgan.token('content', (request, result) => JSON.stringify(request.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]; 

app.get('/info', (request, response, next) => {
    let requestTime = new Date(Date.now());

    Person.find({})
        .then(persons => {
            response.send(`
                <p>Phonebook has info for ${persons.length} persons</p>
                <p>${requestTime}</p>
            `);
        })
        .catch(error => next(error));   
});

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(error => next(error));    
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findById(id)
        .then(person => {
            if (!person) {
                return response.status(404).json({
                    message: 'Id not found ...'
                });
            }

            response.json(person);
        })
        .catch(error => next(error));    
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error));    
});

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            message: 'Content missing!'
        });
    }

    Person.findOne({ name: request.body.name })
        .then((person) => {
            if (person !== null) {
                return response.status(404).json({
                    message: 'Name should be unique ...'
                });
            } 
            
            const newPerson = new Person({
                name: request.body.name,
                number: request.body.number
            })
            newPerson.save()
                .then((person) => {
                    response.json(person);
                })
                .catch(error => next(error));               
            }
        )
        .catch(error => next(error));    
});

app.put('/api/persons/:id', (request, response, next) => {
    if (!request.body.name || !request.body.number) {
        return response.status(404).json({
            message: 'Content missing!'
        });
    }

    Person.findOneAndUpdate(
        { name: request.body.name }, 
        { number: request.body.number }, 
        { new: true, runValidators: true, context: 'query' }
    )
        .then(person => {
            response.json(person);
        })
        .catch(error => next(error));    
});

const errorHandler = (error, request, response, next) => {
    console.log("In error handler ");
    console.log("Error: ", error.message);

    if (error.name === 'CastError') {
        return response.status(500).json({ message: 'Invalid id...' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ message: error.message });
    }

    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});