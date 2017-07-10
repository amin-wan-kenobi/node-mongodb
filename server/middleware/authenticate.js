const {User} = require('../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        
        //Instead of sending the response here, we will add the user to the request and pass it forward
        req.user = user;
        req.token = token;
        next();
    }).catch( (e) => {
        //401 means authentication invalid
        res.status(401).send();
    });
};

module.exports = {
    authenticate
}