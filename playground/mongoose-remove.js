const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('../server/models/user');

Todo.remove({}).then( (result) => {
    console.log(result);
}, (err) => {
    console.log(err);
});

Todo.findOneAndRemove({
    _id: ''
}).then( (todo) => {
    console.log(todo);
}, (err) => {
    console.log(err);
});

Todo.findByIdAndRemove('595e517e2b5935670e1ff2d3').then( (todo) => {
    console.log(todo);
}, (err) => {
    console.log(err);
});