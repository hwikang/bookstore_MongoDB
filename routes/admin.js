const express= require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../util/path')

//inport controllers
const adminController = require('../controllers/admin') 

router.get('/add-product',adminController.getAddProduct); //controller
//함수 뗴어내서 콘트롤러에 적용
router.post('/add-product',adminController.postAddProduct);
router.get('/products',adminController.adminProduct);

router.get('/edit-product/:productId',adminController.getEditProduct)
router.post('/edit-product',adminController.postEditProduct);
router.post('/delete-product/:productId',adminController.postDeleteProduct);

module.exports = router;