const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');

const sequelize = require('./util/db');
const Product =require('./models/product');
const User =require('./models/user');
const Cart =require('./models/cart');
const CartItem =require('./models/cart-item');
const Order =require('./models/order');
const OrderItem =require('./models/order-item');

app.set('view engine','ejs');  
app.set('views','views')

//connect excute  -> promise

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public"))) 

//db에서가져오기  , req.user
app.use((req,res,next)=>{
    User.findByPk(1)  //user의 첫번째 레코드
    .then(user=>{
        //req 객체에 저장
        req.user = user;
        //console.log('req.user=',req.user)
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin',adminRoutes);  //route와 data가둘다 있음
app.use(shopRoutes);

app.use(error.notFound)



///////////////////ASS
//1.belongsTo : 1:1
//product , cart 의 부모는 user
//-> product는 create/set/getUser 사용가능
//association  //user가 product만듬    //user가 삭제되면 user의 product도지워짐
Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'})  
//이러면 PRODUCT테이블은 USER의 ID정보를 가지게됨
//2.hasMany : 1:N
//user.getProducts() 가능해짐
User.hasMany(Product);
User.hasOne(Cart); //1:1 관계
Cart.belongsTo(User); //cart는 userid가짐 부모관계
//3. n:m 관계
Cart.belongsToMany(Product,{through : CartItem}) //1cart - many products  이연결을 저장할곳(cartItem))
Product.belongsToMany(Cart,{through : CartItem}) //1product - many cart
//cartitem 은 cartid 와 productid 를 모두가짐 
Order.belongsTo(User); //1오더는 1명이함
User.hasMany(Order);  //한명이여러개 주문
Order.belongsToMany(Product,{through:OrderItem});
//////////////////ASS
sequelize
    //.sync({force:true})  //DROP TABLE IF EXISTS and create
    .sync()//model을 보고 테이블 만듬 
    .then(result =>{
        return User.findByPk(1)  //        
    })
    .then(user=>{
        if(!user){
            return User.create({name:'max',email:'khdrogba@gmail.com'})  //레코드생성,promise반환
        }
        return user //Promise.resolve(user) 이렇게자동으로됨
    })
    .then(user=>{
        user.createCart();   //관계가있어서 ㅅ가능
    })
    .then(cart=>{      
        app.listen(3000); 
    })
    .catch(err=>console.log(err));
