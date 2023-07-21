const express = require('express')
const router = express.Router()
const SalesController = require('../controllers/sales.controller')
const { verifyAccessToken, isUser, isStaff} = require('../helpers/jwtHelper')

router.post('/sales',[verifyAccessToken,isUser], SalesController.register)
router.get('/sales/dashboard',[verifyAccessToken,isUser], SalesController.get_dashboard)
router.put('/sales/update/:id',[verifyAccessToken,isUser], SalesController.update)
router.put('/sales/delete/:id',[verifyAccessToken,isUser], SalesController.delete)
router.get('/sales/get/:page',[verifyAccessToken,isUser], SalesController.get_all)
router.get('/sales/get/user/orders',[verifyAccessToken,isUser], SalesController.get_user_orders)
router.get('/sales/get/id/:id',[verifyAccessToken,isUser], SalesController.get_by_id)

module.exports = router