const mongodb = require('mongodb');
const Product = require('../models/product');
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req,res,next)=>{   
    
    res.render("admin/edit-product",{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false
    });
};
exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description; 
    console.log("user="+req.user)
    //association 이있으면 createProduct()메소드가생김
    const product = new Product(title,price,description,imageUrl,null,req.user._id)
    .save()
    .then(result =>{
        console.log("created product");
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));   

};

exports.getEditProduct= (req,res,next)=>{
    //controller에서 edit쿼리 확인, 이건무조건 스트링들ㅇ옴
    const editMode =req.query.edit;
    console.log(editMode)
    if(!editMode) return res.redirect('/');
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product=>{
        if(!product) return res.redirect('/');
        res.render("admin/edit-product",{
            pageTitle:'Add Product',
            path:'/admin/edit-product',
            editing :editMode,
            product :product
        })
    })
    .catch();
    
    
}
exports.postEditProduct= (req,res,next) =>{
    const prodId = req.body.productId
    const updatedTitle= req.body.title;
    const updatedPrice= req.body.price;
    const updatedImageUrl= req.body.imageUrl;
    const updatedDesc= req.body.description;
   
    //기존정보들가지고 새객체만듬
    const product = new Product(updatedTitle,updatedPrice,updatedDesc,updatedImageUrl,new ObjectId(prodId),req.user._id);
    product.save()
    .then(result=>{
        console.log("updated product")
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err));
  
}
exports.adminProduct = (req,res,next)=>{
    Product.fetchAll()
    .then(products=>{
        res.render('admin/products',{
            prods:products,
            pageTitle:'Admin products',
            path:'/admin/products'

        });
    })    
    .catch(err=>console.log(err));
       
}

exports.postDeleteProduct = (req,res,next) =>{
    const prodId = req.params.productId;
    Product.deleteById(prodId)
    .then(result=>{
        console.log("destroyed");
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err))
    
};
