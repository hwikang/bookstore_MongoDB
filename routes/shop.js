const express= require('express');
const path = require('path')
const router = express.Router();

const shopController =require('../controllers/shop')
router.get('/',shopController.getIndex);
router.get('/cart',shopController.getCart);
router.post('/cart',shopController.postCart);
router.post("/cart-delete-item",shopController.postCartDeleteProduct)
router.get('/orders',shopController.getOrders);
router.post('/create-order',shopController.postOrder)
//이걸 먼저해야 밑에꺼영향안받음
router.get('/products',shopController.getProducts);
// :아무이름  -> products/ 포함하는 모든것
//productId 에 값이들어가서 넘어감 ->콘트롤러에서 사용
router.get('/products/:productId',shopController.getProduct)
router.get('/checkout',shopController.getCheckout);


module.exports=router;