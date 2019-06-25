//connect to mongoDB
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db ;  //connect을 담을 변수

const mongoConnect = (callback) =>{
    mongoClient.connect('mongodb+srv://hwikang:tqTmblCALlnOWG0J@node-cluster-dftog.mongodb.net/test?retryWrites=true&w=majority')
    .then(client=>{
        console.log('connected to mongodb');
        _db = client.db()  //해당 db에연결 , keep running
        callback()    
    })
    .catch(err=>{
        console.log(err);
        throw err;
    })
}

const getDb = ( ) =>{
    if(_db){
        return _db;
    }
    throw 'no db founded!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;