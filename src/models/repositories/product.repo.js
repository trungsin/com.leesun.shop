'use strict'
const { getSelectData, getUnSelectData } = require('../../utils')
const { product,electronic,clothing,furniture} = require('../product.models')
const {Types} = require('mongoose')
const findAllDraftsForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}
const findAllPublishedForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}
const searchProductsByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch}
    },{score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()
    return results
}
const publishProductByShop = async({product_shop, product_id}) =>{
    const fountShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!fountShop) return null
    fountShop.isDraft = false
    fountShop.isPublished =  true
    const {modifiedCount} = await fountShop.updateOne(fountShop)
    return modifiedCount
}
const unPublishProductByShop = async({product_shop, product_id}) =>{
    const fountShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!fountShop) return null
    fountShop.isDraft = true
    fountShop.isPublished =  false
    const {modifiedCount} = await fountShop.updateOne(fountShop)
    return modifiedCount
}
const findAllProducts =  async({limit, sort, page, filter, select}) => {
    const skip = (page) * limit;
    const sortBy = sort === 'ctime' ? {_id :-1} : {_id:1}
    const products = await product.find( filter)
    .sort(sortBy)
    // .skip(limit)
    .select(getSelectData(select))
    .lean()

    return products
}

const findProduct =  async({product_id, unSelect}) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}
const queryProduct = async({query, limit, skip}) =>{
    return await product.find(query).
    populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct
}
