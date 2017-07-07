const { SHA256 } = require('crypto-js');
var message = 'Hello';
var hash = SHA256(message).toString();
console.log(hash);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'Salt the hash with secret').toString()
}

//Now let's check the hash

var resultHash = SHA256(JSON.stringify(token.data) + 'Salt the hash with secret').toString();
if(resultHash === token.hash){
    console.log('Data was not changed');
}else{
    console.log('Data was changed. DO NOT TRUST!!!!');
}





///////////////////////////////////////
//using jwt
const jwt = require('jsonwebtoken');
var data2 = {
    id: 10
};

var token2 = jwt.sign(data2, 'MySecret');
console.log(token2);

var decodedResult = jwt.verify(token2, 'MySecret');
console.log(decodedResult);