const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/comment.controller')
const { verifyAccessToken, isUser} = require('../helpers/jwtHelper')

router.post('/comment',[verifyAccessToken,isUser], CommentController.register)
router.put('/comment/update/:id',[verifyAccessToken,isUser], CommentController.update)
router.put('/comment/delete/:id',[verifyAccessToken,isUser], CommentController.delete)
router.get('/comment/get/product/:id', CommentController.get_all)
router.get('/comment/rating/product/:id', CommentController.get_rating)

module.exports = router