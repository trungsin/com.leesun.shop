'use strict'
const ProductService = require('../services/product.services')
const { CREATED, OK, SuccessReponse } = require('../core/success.response')
class ProductController{

    //POST
    createProduct = async(req, res, next) => {
        new SuccessReponse({
            message: 'Create Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    publishProductByShop = async (req, res, next)=>{
        new SuccessReponse({
            message: 'Published Product success!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next)=>{
        new SuccessReponse({
            message: 'Unpublished Product success!',
            metadata: await ProductService.unpublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    
    //END POST//
    // QUERY //
    /**
     * @desc Get all Drafts for Shop
     * @param {} req 
     * @param {*} res 
     * @param {*} next 
     * @returns { JSON }
     */
    getAllDraftForShop = async(req, res, next) => {
        new SuccessReponse({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishedForShop = async(req, res, next) => {
        new SuccessReponse({
            message: 'Get list Published success!',
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getListSearchForShop = async(req, res, next) => {
        new SuccessReponse({
            message: 'Get list Search Published Product success!',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res)
    }
    findAllProducts = async(req, res, next) => {
        new SuccessReponse({
            message: 'Search All Published Product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    findProduct = async(req, res, next) => {
        new SuccessReponse({
            message: 'Search All Published Product success!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id})
        }).send(res)
    }
    // END QUERY//
   
}

module.exports = new ProductController()