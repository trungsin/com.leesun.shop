'use strict'

const {model,Schema} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permissions:{
        type:[String],
        required:true,
        enum: ['0000','1111','2222'],
    }
}, {
    timestamps: true,
    collection: 'Apikeys'
});

//Export the model
module.exports = model('Apikey', apiKeySchema);