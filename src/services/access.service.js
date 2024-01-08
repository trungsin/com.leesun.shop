'use strict'

const shopModel = require("../models/shop.models")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auths/authUtils")
const { getInfoData } = require("../utils")
const RoleShop = {
    SHOP: '0001',
    WRITE: '0002',
    EDITOR: '0003',
    ADMIN: '0004'

}

class AccessService{
    static signUp = async ({name, email, password}) => {
        try{
            //step 1: check mail exists???
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop) {
                return{
                    code:'xxx',
                    message: 'Shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            console.log(passwordHash);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if(newShop){
                // create private, publickey
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // public key crypto standards 1
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1', // public key crypto standards 1
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                console.log({privateKey, publicKey})// save collection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    return{
                        code:'xxx',
                        message: 'public key error!'
                    }
                }
         
                //create token pair
                const tokens = await createTokenPair({userId: newShop.__v, email}, publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields:['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return{
                code: 200,
                metadata: null
            }

        } catch (error){
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService