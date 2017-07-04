const {MongoClient, ObjectID} = require('mongodb');
//OR
//const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err){
        return console.log(`Error happened ${err}`);
        //return does not do anything. just does not go further
        //Or we can use if-else
    }
    //Insert a todo document
    // db.collection('Todos').insertOne({
    //     text: 'Learn MongoDB',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert a user document
    db.collection('Users').insertOne({
        name: 'Sarah',
        age: 33,
        location: 'Singapore'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert into Users', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    });
    
    db.close();
});