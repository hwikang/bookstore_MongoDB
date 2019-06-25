//이함수를 쓰면 db연결및 접근가능
const getDb = require('../util/db').getDb
const mongodb = require('mongodb')
class Product{
    constructor(title,price,description,imageUrl,id,userId){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this._id = id ? new mongodb.ObjectId(id): null;  //mongodb 랑맞추려고 , id있으면하고 없음녀 null
        this.userId = userId
    }
    save(){
        const db = getDb();  //connection
        let dbOp ; 
        if(this._id){ //id이미존재하면?
            //update
            dbOp = db.collection('products')  //id로찾고 업뎃   , set:this 하면 알아서 맞춰서 다들어감
                    .updateOne({_id:this._id},{$set:this})
        }else{           
            dbOp = db.collection('products') //product collection참조 , 없으면 생산함
                    .insertOne(this)  //집어넣기 , this= product객체 , 결과와함께 promise반환
                    
        }
        return dbOp
            .then(result=>{
                console.log(result)
            })
            .catch(err=>{
                console.log(err)
            })

    }
    static fetchAll(){
        console.log("lets fetch")
        const db = getDb();
        return db.collection('products').find()  //cursor(object) 를 리턴 =>결과값을 iterate
        .toArray()
        .then(product=>{
            console.log(product);
            return product;
        })
        .catch(err=>console.log(err))
    }
    static findById(prodId){  //해당 product찾기
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(prodId)})
        .next() //iterator
        .then(product=>{
            console.log(product);
            return product
        })
        .catch(err=>console.log(err))

    }
    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id:new mongodb.ObjectId(prodId)})
        .then(result=>{
            console.log('deleted')
        })
        .catch(err=>console.log(err))
    }
}


module.exports = Product
