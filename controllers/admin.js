
const Product = require('../models/product');

exports.getAddProduct = (req,res,next)=>{
    
    res.render("admin/edit-product",{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false
    });
}
    
exports.getEditProduct= (req,res,next)=>{
    //controller에서 edit쿼리 확인, 이건무조건 스트링들ㅇ옴
    const editMode =req.query.edit;
    console.log(editMode)
    if(!editMode) return res.redirect('/');
    const prodId = req.params.productId;

                //special method    
    req.user.getProducts({where:{id:prodId}})
    //Product.findByPk(prodId)
    .then(products=>{
        const product = products[0]
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
    Product.findByPk(prodId) //기존 제품정보가져옴
    .then(product=>{
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl=updatedImageUrl;
        product.description=updatedDesc;
        return product.save()   //sequelize 메소드, 없으면 만들고있으면 수정한다
        //promise 또 반환
    }).then(result=>{
        console.log("updated product")
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err));
  
}
exports.adminProduct = (req,res,next)=>{
    req.user.getProducts()
    .then(products=>{
        res.render('admin/products',{
            prods:products,
            pageTitle:'Admin products',
            path:'/admin/products'

        });
    })    
    .catch(err=>console.log(err));
       
}
exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description; 

    //association 이있으면 createProduct()메소드가생김
    req.user.createProduct({ //userid가 자동으로 들어간다
        title:title,
        price:price,
        imageUrl: imageUrl,
        description:description,
    })
    .then(result =>{
        console.log("created product");
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));   
           //save database , promise반환     
    // Product.create({
    //     title:title,
    //     price:price,
    //     imageUrl: imageUrl,
    //     description:description,
    //     //userId:req.user.id
    // })
    

};
exports.postDeleteProduct = (req,res,next) =>{
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product=>{
        return product.destroy() //지움,sequelize
    })
    .then(result=>{
        console.log("destroyed");
        res.redirect('/');
    })
    .catch()
    
};
