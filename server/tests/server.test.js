const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const users = [{
    _id: new ObjectID(),
    email: 'user1@example.com',
    password: '1234567890',
    tokens: [{
        access: "auth",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTY0MGYxYWY1NWY1ZDBhYzJjMjQxNWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk5NzI5NjkwfQ.I6Rc7witFRoInXiO6dZbqgbDxEXFs6MXvJxdADD0S6w"
    }]
}, {
    _id: new ObjectID(),
    email: 'user2@example.com',
    password: '0987654321',
    tokens: [{
        access: "auth",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTY0MGY0ZGY1NWY1ZDBhYzJjMjQxNjEiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk5NzI5NzQxfQ.HwTDI5dlRf8d1xGdLSNTDlVd-QBEibfJZUmKiwsTO3Y"
    }]
}];


// beforeEach( (done) => {
//     Todo.remove({}).then( () => {
//         done();
//     })
// });
//Above should be modified as it always remove everything in the collection 
//so that is not really suitable approach

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new TODO', (done) => {
        var text = 'Text todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
    it('should not create data with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });
    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object id', (done) => {
        request(app)
            .get('/todos/1234')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                //Try to find the object you deleted and see if the things was deleted
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object id', (done) => {
        request(app)
            .delete('/todos/1234')
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'New Text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                //Let's make some assertions
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'New Text!!';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('POST /users', () => {
    beforeEach((done) => {
        User.remove({}).then(() => {
            return User.insertMany(users);
        }).then(() => done());
    });

    it('should create new user', (done) => {
        var email = "testUser@example.com";
        var password = "123456";
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).toBe(email);
            })
            .end(done);
    });

    it('should not add duplicated email', (done) => {
        var email = "user1@example.com";
        var password = "123456";
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should give user information by right token', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect( (res) => {
                expect(res.body.user.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should reject request with wrong token', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token + 'WRONG_TOKEN')
            .expect(401)
            .end(done);
    });
});