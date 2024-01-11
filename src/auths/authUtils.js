'use strict'
const JWT = require('jsonwebtoken')
const asyncHandler =  require('../helpers/asyncHandler')
const { AuthFailureError, AuthNotFoundError } = require('../core/error.response')

//service
const {createKeyToken, findByUserId} = require('../services/keyToken.service')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-refresh-token'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn:'2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn:'7 days'
        })
        //
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify::`, decode);
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
        
    }

}
const authentication = asyncHandler( async(req, res, next) =>{
    /*
        1 - check userId missing??
        2 - get accessToken
        3 - verify token
        4 - check user in dbs
        5 - check keystore with this userId?
        6 - Ok all => return next()
    */
   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Client Request')
   console.log('done author 1');

   //2
   console.log('check userid login', userId)
   const keyStore = await findByUserId(userId)
   if(!keyStore) throw new AuthNotFoundError('Not Found KeyStore')
   console.log('done author 2', keyStore);

   //3
   const accessToken = req.headers[HEADER.AUTHORIZATION]
   if(!userId) throw new AuthFailureError('Invalid Authorization Request')
   console.log('done author 3');

   try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid UserId')
        }
        req.keyStore = keyStore
        console.log('check authorization done');
        return next()
   } catch (error) {
        throw error
   }

})
const authenticationV1 = asyncHandler( async(req, res, next) =>{
    /*
        1 - check userId missing??
        2 - get accessToken
        3 - verify token
        4 - check user in dbs
        5 - check keystore with this userId?
        6 - Ok all => return next()
    */
   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Client Request')
   console.log('done author 1');

   //2
   console.log('check userid login', userId)
   const keyStore = await findByUserId(userId)
   if(!keyStore) throw new AuthNotFoundError('Not Found KeyStore')
   console.log('done author 2', keyStore);

   //3
   if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId){
                throw new AuthFailureError('Invalid UserId')
            }
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
                throw error
        }
   }
   const accessToken = req.headers[HEADER.AUTHORIZATION]
   if(!userId) throw new AuthFailureError('Invalid Authorization Request')
   console.log('done author 3');

   try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid UserId')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        console.log('check authorization done');
        return next()
   } catch (error) {
        throw error
   }

})
const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports={
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV1
}