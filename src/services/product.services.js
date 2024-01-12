'use strict'

const {product, clothing, electronic, furniture} = require('../models/product.models')
const { BadRequestError} = require('../core/error.response')
const { findAllDraftsForShop, 
        publishProductByShop,
        findAllPublishedForShop, 
        unPublishProductByShop,
        searchProductsByUser} = require('../models/repositories/product.repo')

// define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing',
        payload
    */
   //old case study
    // static async createProduct(type, payload){
    //     switch(type){
    //         case 'Electronics':
    //             console.log('Create Electronic');
    //             return new Electronic(payload).createProduct()
    //         case 'Clothing':
    //             console.log('Create Clothing');
    //             return new Clothing(payload).createProduct()
    //         default:
    //             throw new BadRequestError(`Invalid Product Types ${type}`)
    //     }
    // }
    static productRegistry = {} // key-class
    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
         return new productClass(payload).createProduct()
    }
    // PUT //
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }
    static async unpublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    // END PUT //
    
    //Query //
    static async findAllDraftForShop( {product_shop, limit = 50, skip = 0} ){
        const query = { product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishedForShop( {product_shop, limit = 50, skip = 0} ){
        const query = { product_shop, isPublished: true}
        return await findAllPublishedForShop({query, limit, skip})
    }
    static async searchProducts({keySearch}){
        return await searchProductsByUser({keySearch})

    }
}
/*
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics','Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true}
*/
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    // create new product
    async createProduct(product_id){
        return await product.create({...this, _id: product_id})
    }
}
class Clothing extends Product{
    async createProduct(){
        console.log('create attributes::', this.product_attributes);
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Create new Clothing error')
        console.log('create product::');
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}

class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')
        return newProduct;
    }
}
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory