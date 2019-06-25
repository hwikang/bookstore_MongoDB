//router에있는함수들을 다가져옴

const Product = require('../models/product'); //sequelize model


exports.getIndex = (req,res,next)=>{
    Product.fetchAll()  //products 리턴
    .then(products=>{
        //console.log(products)
        res.render('shop/index',{
            prods:products,
            pageTitle:'Index',
            path:'/'  
        }) 
    })
    .catch(err=>{
        console.log(err)
    })
   

};
exports.getProducts = (req,res,next)=>{
    Product.fetchAll()  //products 리턴
    .then(products=>{
        //console.log(products)
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All products',
            path:'/products',
            asProducts:products.length>0,
            activeShop:true,
            activeAddShop:false,
            formsCSS:false,
            productCSS:true            
        })
    })
    .catch(err=>{
        console.log(err)
    })
   
};
//productdetail
exports.getProduct = (req,res,next) =>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product=>{
       console.log("product=",product) //[ {데이터},{}.. }]이렇게 들어있음
        res.render('shop/product-detail',{
            product:product,
            pageTitle:product.title,
            path:"/product"
        });
    })
    .catch(err=>console.log(err));
}

//cart
exports.getCart = (req,res,next)=>{
    req.user.getCart()
     .then(products=>{
       //  console.log(products)
        res.render('shop/cart',{
            pageTitle:'Your cart',
            path:'/cart',
            products:products       
        });

     })
     .catch(err=>console.log(err));
 
};
    
 
//cart 와 product는 1:n관계 , cartitem을 통해
exports.postCart =(req,res,next)=>{
    const prodId = req.body.productId
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product); 
        
    })
    .then(result=>{
        console.log(result);
        res.redirect('/');
    })
    .catch()

}
exports.postCartDeleteProduct = (req,res,next) =>{
    const prodId = req.body.productId;
    req.user.deleteCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));


};
exports.getOrders = (req,res,next)=>{
                //order가져올때 관련된 product도 가져와 (belongstoMany 있어서가능)
    req.user.getOrders() 
    .then(orders=>{
        console.log(orders)
        res.render('shop/orders',{
            pageTitle:'Your Orders',
            path:'/orders',
            orders:orders
        });
    })
    .catch(err=>console.log(err))
    
}
exports.postOrder= (req,res,next)=>{
    req.user.addOrder()
    .then(result=>{
        console.log("add order="+result)
        res.redirect('/orders');
    })
    .catch(err=>console.log(err))
}

exports.getCheckout = (req,res,next)=>{
     res.render('shop/checkout',{
         path:'/checkout',
         pageTitle:'Checkout'
     })
}
