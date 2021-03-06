require('./config/config');

const _ = require('lodash');
const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// app.post('/todos', (req, res) => {
//     var todo = new Todo({
//         text: req.body.text
//     });

//     todo.save().then((doc) => {
//         res.send(doc);
//     }, (err) => {
//         //https://httpstatuses.com/
//         res.status(400).send(err);
//     })
// });
//Above was old Todos which did not check any authentication so we replaced it with below
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// app.get('/todos', (req, res) => {
//     Todo.find().then((todos) => {
//         //Always better to return an object so we can send other good stuff as well if we want to
//         res.send({todos});
//     }, (err) => {
//         res.status(400).send(err);
//     })
// });
//Above was old get todos which needs to get updated. So we can only get todos for the one who has created it

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then( (todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// app.get('/todos/:id', (req, res) => {
//     var id = req.params.id;
//     if(!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }

//     Todo.findById(id).then((todo) => {
//         if(!todo){
//             return res.status(404).send();
//         }
//         //res.send(todo);
//         res.send({todo});
//     }, (err) => {
//         res.status(400).send(err);
//     }).catch((e) => {
//         res.status(400).send();
//     })
// });

//No more findById, because others still can have access to it.
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    }).catch( (e) => {
        res.status(400).send();
    });
});

// app.delete('/todos/:id', (req, res) => {
//     var id = req.params.id;
//     if(!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }
//     Todo.findByIdAndRemove(id).then( (todo) => {
//         if(!todo){
//             return res.status(404).send();
//         }
//         res.send({todo});
//     }, (err) => {
//         res.status(400).send(err);
//     }).catch( (e) => {
//         res.status(400).send(e);
//     })
// });

// app.delete('/todos/:id', authenticate, (req, res) => {
//     var id = req.params.id;
//     if(!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }
//     Todo.findOneAndRemove({
//         _id: id,
//         _creator: req.user._id
//     }).then( (todo) => {
//         if(!todo){
//             return res.status(404).send();
//         }
//         res.send({todo});
//     }, (err) => {
//         res.status(400).send(err);
//     }).catch( (e) => {
//         res.status(400).send(e);
//     })
// });

app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    try{
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }catch(e){
        res.status(400).send(e);
    }
});

// app.patch('/todos/:id', (req, res) => {
//     var id = req.params.id;
//     var body = _.pick(req.body, ['text', 'completed']);

//     if(!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }

//     if(_.isBoolean(body.completed) && body.completed){
//         body.completedAt = new Date().getTime();
//         body.completed = true;
//     }else{
//         body.completed = false;
//         body.completedAt = null;
//     }

//     Todo.findByIdAndUpdate(id, {$set:{
//             text: body.text,
//             completed: body.completed,
//             completedAt: body.completedAt
//         }},{new: true}).then( (todo) => {
//         if(!todo){
//             return res.status(404).send();
//         }
//         res.send({todo});
//     }, (err) => {
//         res.status(404).send(err);
//     }).catch( (e) => {
//         res.status(400).send(e);
//     });
// });

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set:{
            text: body.text,
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

// app.post('/users', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);
//     var user = new User(body);
//     user.save().then( () => {
//         return user.generateAuthToken()
//     }).then((token) => {
//         res.header('x-auth', token).send({user});
//     })
//     .catch( (e) => {
//         res.status(400).send(e);
//     });
// });

app.post('/users', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send({user});
    }catch(e){
        res.status(400).send(e);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/users/me', authenticate, (req, res) => {
    //We already have req object here by authenticate middleware
    res.send({user: req.user});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
// app.post('/users/login', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);
//     User.findByCredentials(body.email, body.password).then( (user) => {
//         return user.generateAuthToken().then( (token) => {
//             res.header('x-auth', token).send({user});
//         });
//     })
//     .catch((e) => {
//         res.status(400).send();
//     });
// });

//Below is the same as above but with the help of async
app.post('/users/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send({user});
    }catch(e){
        res.status(400).send();
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

// app.delete('/users/me/token', authenticate, (req, res) => {
//     req.user.removeToken(req.token).then( () => {
//         res.status(200).send();
//     }, () => {
//         res.status(400).send();
//     });
// });

//below is the same as above but with the help of async await
app.delete('/users/me/token', authenticate, async (req, res) => {
    try{
        await req.user.removeToken(req.token);
        res.status(200).send();
    }catch(e){
        res.status(400).send();
    }
});

app.listen(port, () => console.log(`Server started and listening to Port ${port}`));

module.exports = {app};