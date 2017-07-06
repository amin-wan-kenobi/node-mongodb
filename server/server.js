const _ = require('lodash');
const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        //res.send(todo);
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then( (todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    }).catch( (e) => {
        res.status(400).send(e);
    })
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
        body.completed = true;
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:{
            completed: body.completed,
            completedAt: body.completedAt
        }},{new: true}).then( (todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(404).send(err);
    }).catch( (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => console.log(`Server started and listening to Port ${port}`));

module.exports = {app};