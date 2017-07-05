const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('../server/models/user');

var id = '595c2b71fc4e7a1fda4485a4';
var userId = '595bd27ecaec3d1293f2d44d';

if(!ObjectID.isValid(id)){
    return console.log('Invalid ID');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('TODOS', todos);
// }, (err) => {

// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('TODO', todo);
// }, (err) => {

// });

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id Not Found');
    }
    console.log('Find By Id', todo);
}, (err) => {
    console.log('Error', err);
}).catch( (e) => {
    console.log(e);
});

User.find({
    _id: userId
}).then( (user) => {
    console.log('User Find', user);
}).catch((err) => console.log(err));

User.findOne({
    _id: userId
}).then( (user) => {
    console.log('User FindOne', user);
}).catch((err) => console.log(err));

User.findById(userId).then((user) => console.log(user), (err) => console.log(err)).catch((e) => console.log(e));