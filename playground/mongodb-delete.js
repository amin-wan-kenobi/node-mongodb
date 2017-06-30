const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log(`Error happened ${err}`);
    }

    //deleteMany
    db.collection('Todos').deleteMany({
        text: 'Use Vaccume Cleaner'
    }).then((res) => {
        console.log('Delete All', JSON.stringify(res, undefined, 2));
    }, (err) => {
        console.log(err);
    });
    //deleteOne
    db.collection('Todos').deleteOne({
        text: 'Learn MongoDB'
    }).then((res) => {
        console.log('Delete One', JSON.stringify(res, undefined, 2));
    }, (err) => {
        console.log(err);
    });
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        text: 'Learn MongoDB'
    }).then((res) => {
        console.log('Find One and Delete', JSON.stringify(res, undefined, 2));
    }, (err) => {
        console.log(err);
    });
    db.close();
});