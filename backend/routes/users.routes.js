const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users.controller')
const { verifyAccessToken, isMaster} = require('../helpers/jwtHelper')

router.post('/user', UserController.register)
router.put('/user/update/:id',[verifyAccessToken,isMaster], UserController.update)
router.put('/user/delete/:id',[verifyAccessToken,isMaster], UserController.delete)
router.put('/user/login/google',UserController.register_continue_with_google)
router.get('/user/get/all',[verifyAccessToken,isMaster], UserController.get_all)
router.get('/user/get/id/:id',[verifyAccessToken,isMaster], UserController.get_by_id)

module.exports = router