const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/category.controller')
const { verifyAccessToken,isUser,isMaster } = require('../helpers/jwtHelper')

router.post('/category',[verifyAccessToken,isMaster], CategoryController.register)
router.put('/category/update/:id',[verifyAccessToken,isMaster], CategoryController.update)
router.put('/category/delete/:id',[verifyAccessToken,isMaster], CategoryController.delete)
router.get('/category/get',[verifyAccessToken,isUser], CategoryController.get_all)
router.get('/category/search/:search',[verifyAccessToken,isUser], CategoryController.search)
router.get('/category/get/id/:id',[verifyAccessToken,isUser], CategoryController.get_by_id)

module.exports = router