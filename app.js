const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');


const mongoConnect = require('./util/db').mongoConnect;
const User = require('./models/user')

app.set('view engine','ejs');  
app.set('views','views')

//connect excute  -> promise

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public"))) 

//db에서가져오기  , req.user
app.use((req,res,next)=>{
    User.findById("5d11d6ab0e1a6d0be4190d4c")
    .then(user=>{
        console.log("user in app.js="+user)
        //data , model add cart... 하기위해 진짜 class객체
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err => console.log(err))
    
})

app.use('/admin',adminRoutes);  //route와 data가둘다 있음
app.use(shopRoutes);

app.use(error.notFound)

// client불러와서 실행
mongoConnect(()=>{   
   
    app.listen(3000)
});
