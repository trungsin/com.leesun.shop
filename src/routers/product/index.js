'use strict'

const express = require("express")
const productController = require('../../controllers/product.controller')
const router = express.Router()

const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV1 } = require("../../auths/authUtils")

router.get('/search/:keySearch', asyncHandler(productController.getListSearchForShop))

//authentication
router.use(authenticationV1)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))


//QUERY //
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))

module.exports = router