const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;

const ObjectId = mongodb.ObjectId;
class User{
    constructor(username,email,cart,id){
        this.name = username;
        this.email = email;
        this.cart = cart; ///obj {items:[]}
        this._id = id;
    }
    save(){
        const db = getDb();
        let dbOp ; 
        if(this._id){
            //update
        }else{
            //insert
           dbOp = db.collection('users').insertOne(this)
            
        }
        dbOp
        .then(result=>{
            console.log("user save result ="+result)
        })
        .catch(err=>console.log(err))
    }

    addToCart(product){

        //이미 카트에있는 제품의 인덱스, 
        const cartProductIndex = this.cart.items.findIndex(cartProduct=>{          
            return product._id.toString() === cartProduct.productId.toString();  //정확한 스트링타입이아님
        })
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];  //item : [] 에서 배열부분

        //수정
        if(cartProductIndex>=0){            
            newQuantity = this.cart.items[cartProductIndex].quantity+1 //인덱스로 아이템찾음
            //console.log("newQuantity="+newQuantity)
            updatedCartItems[cartProductIndex].quantity = newQuantity;  //수정 아이템 인덱스변경
        }else{        
            //new       
            updatedCartItems.push({ 
                productId: new ObjectId(product._id) ,//product 의모든걸 넣으면 product바뀌때 문제
                quantity:newQuantity
            }) 
        }    
        
        const updatedCart = {
            items : updatedCartItems
        }
        
        const db = getDb();
        return db.collection('users')
            .updateOne(
            {_id:new ObjectId(this._id)},  //조건
            {$set:{cart : updatedCart} }  //필드가 없으면 만들어줌
        )
    }; //add To cart
    getCart(){ //카트불러서 productid가지고 프로덕트정보가져오기
        const db =getDb();
        //product 아이디 불러옴
        const productsId = this.cart.items.map(i=>{
            return i.productId  
        });

        //console.log("productsId="+productsId)
                                            //in오퍼레이터 : 배열안에 있는것들 다뽑음(or)
        return db.collection('products').find({_id:{$in:productsId}}) //cursor(object) 반환
        .toArray()
        .then(products=>{
            //console.log(products);
            return products.map(p=>{                 
                return {
                    ...p,
                    quantity:this.cart.items.find(i=>{  //db가아닌 array의 메소드
                        return i.productId.toString() === p._id.toString();   //조건
                    }).quantity 
                } 
            });
        })
        .catch(err=>console.log(err));
    }

    deleteCart(productId){
        const db = getDb();
        const deletedCart = this.cart.items.filter(i=>{
            return i.productId.toString() !== productId.toString()
        })
        console.log("deletedCart=",deletedCart)
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            {$set:{cart:{items:deletedCart}}}
        );
    }

    addOrder(){
        const db = getDb();
        return this.getCart().then(products=>{
            const order ={
                items: products,  //cart처럼 id+quantity정보
                user :{
                    _id:new ObjectId(this._id),
                    name : this.name
                }
            };
            return db.collection('order').insertOne(order)
                
        })
        .then(result=>{
            this.cart = {items:[]};
            return db.collection('users').updateOne(
                {_id: new ObjectId(this._id)},
                {$set:{cart: this.cart}}
            )
        })
        

        
    }
    getOrders(){
        const db = getDb();   //order는 1개 user가있음 , 1 user는 여러 order가 있음
        return db.collection('order').find({'user._id':new ObjectId(this._id)})  //path를통해할떄는 스트링으로 보내야함
        .toArray()
        
    }

    static findById(userid){
        const db = getDb();
        return db.collection('users').find({_id:new ObjectId(userid)})
        .next()
        .then(user =>{
            //console.log(user);
            return user;
        })
        .catch(err=>console.log(err))
    }
}

module.exports= User;