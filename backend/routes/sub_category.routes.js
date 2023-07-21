const express = require('express')
const router = express.Router()
const SubCategoryController = require('../controllers/sub_category.controller')
const { verifyAccessToken,isUser, isMaster } = require('../helpers/jwtHelper')

router.post('/sub_category',[verifyAccessToken,isMaster], SubCategoryController.register)
router.put('/sub_category/update/:id',[verifyAccessToken,isMaster], SubCategoryController.update)
router.put('/sub_category/delete/:id',[verifyAccessToken,isMaster], SubCategoryController.delete)
router.get('/sub_category/get',[verifyAccessToken,isUser], SubCategoryController.get_all)
router.get('/sub_category/search/:search',[verifyAccessToken,isUser], SubCategoryController.search)
router.get('/sub_category/get/id/:id',[verifyAccessToken,isUser], SubCategoryController.get_by_id)

module.exports = router