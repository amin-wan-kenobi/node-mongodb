const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log(`Error happened ${err}`);
    }

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('595670886cef2105d43745f3')
    }, {
        $set: {
            name: 'Incredible Mr A'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    db.close();
});