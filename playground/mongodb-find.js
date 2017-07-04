const {MongoClient, ObjectID} = require('mongodb');
//OR
//const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err){
        return console.log(`Error happened ${err}`);
        //return does not do anything. just does not go further
        //Or we can use if-else
    }
    db.collection('Todos').find(
            {_id: new ObjectID('59566f1129066a05c0b0b8f3')}
        ).toArray().then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log('Error happened', err);
    });

    db.collection('Users').find({
        name: 'Ayako'
    }).count().then((countNo) => {
        console.log(`User's Count: ${countNo}`);
    }, (err) => {
        console.log('Error happened:', err);
    });
    
    db.close();
});