const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'user1@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userOneId, access: 'auth'}, 'MySecret').toString()
    }]
}, {
    _id: userTwoId,
    email: 'user2@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userTwoId, access: 'auth'}, 'MySecret').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        //both userOne and userTwo are promises
        //We can do something really cool
        //We use Promise.all which takes an array of promises and then when all of them are resolved, THEN
        //it would move forward
        //Promise.all([userOne, userTwo]).then( () => {});
        //above means till both userOne and userTwo are not saved in the DB, we won't have then

        return Promise.all([userOne, userTwo]);
    }).then( () => done());
}

module.exports = {
    todos, populateTodos, users, populateUsers
}