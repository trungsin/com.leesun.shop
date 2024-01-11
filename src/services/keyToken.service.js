'use strict'

const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')
class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
            
        }
    }

    static findByUserId = async (userId) => {
        console.log('search key by shop', userId);
        const oid = new Types.ObjectId(userId)
        return await keytokenModel.findOne({user: oid})
    }
    static removeKeyById = async(id) => {
        return await keytokenModel.deleteOne(id)
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken})//.lean()
    }
    static deleteKeyById = async (userId) => {
        const oid = new Types.ObjectId(userId)
        return await keytokenModel.deleteOne({user: oid})
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }
}


module.exports = KeyTokenService