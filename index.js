const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// app.use(morgan('tiny'));

morgan.token('content', (request, result) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]; 

app.get('/info', (request, response) => {
    let requestTime = new Date(Date.now());
    response.send(`
        <p>Phonebook has info for ${persons.length} persons</p>
        <p>${requestTime}</p>
    `);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = +request.params.id;
    const person = persons.find(person => person.id === id);

    if (!person) {
        response.status(404).end();
    }

    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    console.log("request.body = ", request.body);

    if (!request.body.name || !request.body.number) {
        return response.status(404).json({
            error: 'Content missing!'
        });
    }

    if (persons.find(person => person.name === request.body.name)) {
        return response.status(404).json({
            error: 'Name must be unique ...'
        });
    }

    const newId = Math.floor(Math.random() * 100000);
    const newPerson = {
        id: newId,
        name: request.body.name,
        number: request.body.number
    }
    persons.push(newPerson);

    response.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});