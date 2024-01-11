'use strict'

const express = require("express")
const productController = require('../../controllers/product.controller')
const router = express.Router()

const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require("../../auths/authUtils")


//authentication
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))


module.exports = router