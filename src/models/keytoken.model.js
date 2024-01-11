'use strict'

const {Schema, model, Types} = require('mongoose')

// const DOCUMENT_NAME = 'Key'
// const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Types.ObjectId,
        required:true,
        ref:'Shop',
        index:true,
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,
        default:[],
    },
    refreshToken:{
        type:String,
        required:true,
    },
},{
    collection: 'Keys',
    timestamps:true
}
);

//Export the model
module.exports = model('Key', keyTokenSchema);