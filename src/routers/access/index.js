'use strict'

const express = require("express")
const accessController = require('../../controllers/access.controller')
const router = express.Router()

const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV1 } = require("../../auths/authUtils")



//singUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
//signIn
router.post('/shop/login', asyncHandler(accessController.login))


//authentication
router.use(authenticationV1)
//logout
router.post('/shop/logout', asyncHandler(accessController.logout))

router.post('/shop/refreshtoken', asyncHandler(accessController.handlerRefreshToken))


module.exports = router