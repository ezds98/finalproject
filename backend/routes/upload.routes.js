const express = require('express')
const router = express.Router()
const UploadController = require('../controllers/upload.controller.js')
const { verifyAccessToken, isUser } = require('../helpers/jwtHelper')

router.post('/upload',[verifyAccessToken,isUser], UploadController.register)
router.get('/upload/get/:id',[verifyAccessToken,isUser], UploadController.getImage)
router.get('/upload/delete/:id',[verifyAccessToken,isUser], UploadController.deleteImage)



module.exports = router
