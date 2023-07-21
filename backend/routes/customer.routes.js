const express = require('express')
const router = express.Router()
const CustomerController = require('../controllers/customer.controller')
const { verifyAccessToken, isUser } = require('../helpers/jwtHelper')

router.post('/customer',[verifyAccessToken,isUser], CustomerController.register)
router.put('/customer/update/:id',[verifyAccessToken,isUser], CustomerController.update)
router.put('/customer/delete/:id',[verifyAccessToken,isUser], CustomerController.delete)
router.get('/customer/get',[verifyAccessToken,isUser], CustomerController.get_all)
router.get('/customer/search/:search',[verifyAccessToken,isUser], CustomerController.search)
router.get('/customer/get/id/:id',[verifyAccessToken,isUser], CustomerController.get_by_id)


module.exports = router