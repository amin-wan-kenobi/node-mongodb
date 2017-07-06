//Below is required to have a separate database for both test and development
var env = process.env.NODE_ENV || 'development';
console.log('env *******', env);
if(env === 'development'){
    process.env.PORT = 3000;
    // no need for || 3000 below anymore.
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    // no need for || mongodb://localhost:27017/TodoApp in mongoose.js file anymore 
}else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}