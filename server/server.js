var express = require('express');
var bodyParser = require('body-parser');
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        //https://httpstatuses.com/
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        //Always better to return an object so we can send other good stuff as well if we want to
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    })
});

app.listen(3000, () => console.log('Server started and listening to Port 3000'));

module.exports = {app};