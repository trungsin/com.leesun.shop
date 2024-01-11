'use strict'

const shopModel = require("../models/shop.models")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const {findByEmail} = require('./shop.service')
const { createTokenPair, verifyJWT } = require("../auths/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")


//service 
const RoleShop = {
    SHOP: '0001',
    WRITE: '0002',
    EDITOR: '0003',
    ADMIN: '0004'

}

class AccessService{
    static handlerRefreshTokenFixed = async({refreshToken, user, keyStore}) => {
        const {userId, email} =  user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened ! Plz relogin')
        }
        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError(`Shop no registered for ${refreshToken}`)
        }
        //check userId
        const foundShop = await findByEmail(email)
        if(!foundShop) throw AuthFailureError(`Shop not registered from email ${email}`)
        console.log('tim email done');
        //create 1 cap moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da su dung add vao de tracking
            }
        })
        return{
            user,
            tokens
        }
        
    }
    /*
        check this token used
    */
    static handlerRefreshToken = async(refreshToken) => {
        //check xem token nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken) {
            //decode xem ai dang pha hoai
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email});
            //xoa thong 
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened ! Plz relogin')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError(`Shop no registered for ${refreshToken}`)

        //verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--',{userId, email});

        //check userId
        const foundShop = await findByEmail(email)
        if(!foundShop) throw AuthFailureError(`Shop not registered from email ${email}`)
        console.log('tim email done');
        //create 1 cap moi
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da su dung add vao de tracking
            }
        })
        return{
            user: {userId, email},
            tokens
        }
    }
    static logout = async(keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({delKey});
        return delKey;
    }
    /*
        1 - check email in dbs
        2 - match password
        3 -  create AT vs RT and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async({email, password, refreshToken = null}) => {
        console.log('login start');
        //1.
        console.log('check email', email);
        const foundShop = await findByEmail(email)
        if(!foundShop) throw new BadRequestError('Error: Shop do not registered')
        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Error: Authentication fail')
        //3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4. 
          //create token pair
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
        console.log(`Created Token Success::`, tokens)

        //5
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })
        return {
            metadata: {
                shop: getInfoData({fields:['_id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }

    }
    static signUp = async ({name, email, password}) => {
        // try{
            //step 1: check mail exists???
            
            const holderShop = await shopModel.findOne({email}).lean()
            console.log('check exist of shop');
            if(holderShop) {
                throw new BadRequestError('Error: Shop already registered!')
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
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
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

        // } catch (error){
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService