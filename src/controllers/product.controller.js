'use strict'
const ProductService = require('../services/product.services')
const { CREATED, OK, SuccessReponse } = require('../core/success.response')
class ProductController{
    createProduct = async(req, res, next) => {
        new SuccessReponse({
            message: 'Create Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
   
}

module.exports = new ProductController()