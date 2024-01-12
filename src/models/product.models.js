'use strict'

const {model, Schema} = require('mongoose')
const slugify = require('slugify')

const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_slug: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics','Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true},
    product_ratingsAverage:{
        type: Number,
        min:[1, 'Rating must be above 1.0'],
        min:[5, 'Rating must be above 5.0'],
        set: (val) => Math.round( val *10)/10
    },
    product_variation: {type: Array, default: []},
    isDraft: {type: Boolean, default:true, index:true, select: false},
    isPublished: {type: Boolean, default: false, index:true, select: false},
}, {
    collection: 'Products',
    timestamps: true
})

// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})
//Document middlewate: runs before save() and create()
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
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
    collection: 'furnitures',
    timestamps: true
})

 module.exports = {
    product: model('Product', productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicsSchema),
    furniture: model('Furniture', furnitureSchema)
 }