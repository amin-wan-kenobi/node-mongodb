const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },//validator: validator.isEmail
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'MySecret').toString();

    user.tokens.push({access, token});
    return user.save().then((user) => {
        return token;
    })
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, 'MySecret');
    }catch(err){
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject('Wrong Token');
    }

    //Success Case
    //findOne returns a promise so we will pass that promise to whoever is calling it
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

//next argument should be provided and to be called eventually
UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            if(salt){
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(hash){
                        user.password = hash;
                        next();
                    }
                })
            }
        });
    }else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}