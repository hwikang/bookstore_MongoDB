//router에있는함수들을 다가져옴

const Product = require('../models/product'); //sequelize model
const Cart = require('../models/cart')
const Order =require('../models/order')

exports.getProducts = (req,res,next)=>{
    Product.findAll()
    .then(products=>{
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
    Product.findAll({where:{id:prodId}}) //배열리턴됨
    //Product.findByPk(prodId) //sequelize 메소드 , 한개리턴됨
    .then(product=>{
       console.log("product=",product) //[ {데이터},{}.. }]이렇게 들어있음
        res.render('shop/product-detail',{
            product:product[0],
            pageTitle:"Product Detail",
            path:"/product"
        });
    })
    .catch(err=>console.log(err));
}

exports.getIndex = (req,res,next)=>{
    Product.findAll()  //squelize 메소드 , where 조건사용가능
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
//cart
exports.getCart = (req,res,next)=>{
    req.user.getCart()
    .then(cart=>{
        //cart product 는 1:n 관계
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart',{
                pageTitle:'Your cart',
                path:'/cart',
                products:products       
            });
        })
        .catch(err=>console.log(err))
       // console.log("cart="+cart)
    })
    .catch(err=>console.log(err))
};
    
 
//cart 와 product는 1:n관계 , cartitem을 통해
exports.postCart =(req,res,next)=>{
    const prodId = req.body.productId
    let fetchedCart ;  //
    let newQuantity =1;

    req.user.getCart()
    .then(cart=>{
        
        fetchedCart = cart  //불러온카트 집어넣음
        return cart.getProducts({where:{id:prodId}})
        
        //없는경우
    })
    .then(products=>{
        let product ;
        if(products.length>0){
         product = products[0];  //
        }
        if(product){ //이미 카트에 해당 product 있는경우 
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity+1;  //수량 수정
            return product  //이미있을때
                            
        }
        return Product.findByPk(prodId) //프로덕트정보 가져옴
            
    })
    .then(product=>{
        return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
       
    })
    .then(()=>{
        res.redirect("/cart")
    })
    .catch(err=>console.log(err))
}
exports.postCartDeleteProduct = (req,res,next) =>{
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where:{id:prodId}})
    })
    .then(products=>{
        const product = products[0];
        product.cartItem.destroy();
    })
    .then(result=>{
        res.redirect('/cart');
    })
    

};
exports.getOrders = (req,res,next)=>{
                //order가져올때 관련된 product도 가져와 (belongstoMany 있어서가능)
    req.user.getOrders({include:['products']}) //eager loading
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
    let fetchedCart;
    req.user.getCart()
    .then(cart=>{
        fetchedCart =cart
        return cart.getProducts();
    })
    .then(products=>{
        return req.user.createOrder() //order테이블은 id만있음
        .then(order=>{                //orderitem.quantity
            //order.addProduct(products,{through :{quantity}})
            return order.addProduct(
                products.map(product=>{ //카트에있는 product들임
                    //table 명과 똑같이
                    product.orderItem = {quantity:product.cartItem.quantity}
                    return product
              })
            );
        })
        .catch(err=>console.log(err))
        //console.log(products)
    })
    .then(result=>{
        fetchedCart.setProducts(null);       
    })
    .then(()=>{
        res.redirect('/orders');
    })
    .catch()
}

exports.getCheckout = (req,res,next)=>{
     res.render('shop/checkout',{
         path:'/checkout',
         pageTitle:'Checkout'
     })
}
