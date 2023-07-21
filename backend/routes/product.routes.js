const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')
const { verifyAccessToken,isStaff } = require('../helpers/jwtHelper')
const CustomerController = require("../controllers/customer.controller");

router.post('/product',[verifyAccessToken,isStaff], ProductController.register)
router.put('/product/update/:id',[verifyAccessToken,isStaff], ProductController.update)
router.put('/product/delete/:id',[verifyAccessToken,isStaff], ProductController.delete)
router.put('/product/get/:page',[verifyAccessToken,isStaff], ProductController.get_all)
router.get('/product/get/recomended',[verifyAccessToken,isStaff], ProductController.get_recomended_products)
router.get('/product/search/:search',[verifyAccessToken,isStaff], ProductController.search)
router.get('/product/get/id/:id',[verifyAccessToken,isStaff], ProductController.get_by_id)
router.get('/product/get/by/recent',[verifyAccessToken,isStaff], ProductController.get_by_recent)


module.exports = router