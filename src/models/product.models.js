'use strict'

const {model, Schema} = require('mongoose')

const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics','Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true}
}, {
    collection: 'Products',
    timestamps: true
})

//define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'clothes',
    timestamps: true
})
//define the product type = electronics
const electronicsSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'electronics',
    timestamps: true
})

//define the product type = furniture
const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'electronics',
    timestamps: true
})

 module.exports = {
    product: model('Product', productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicsSchema),
    furniture: model('Furniture', furnitureSchema)
 }