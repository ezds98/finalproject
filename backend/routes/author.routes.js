const express = require('express')
const router = express.Router()
const AuthorController = require('../controllers/author.controller')
const { verifyAccessToken,isUser, isMaster } = require('../helpers/jwtHelper')

router.post('/author',[verifyAccessToken,isMaster], AuthorController.register)
router.put('/author/update/:id',[verifyAccessToken,isMaster], AuthorController.update)
router.put('/author/delete/:id',[verifyAccessToken,isMaster], AuthorController.delete)
router.get('/author/get',[verifyAccessToken,isUser], AuthorController.get_all)
router.get('/author/search/:search',[verifyAccessToken,isUser], AuthorController.search)
router.get('/author/get/id/:id',[verifyAccessToken,isUser], AuthorController.get_by_id)


module.exports = router