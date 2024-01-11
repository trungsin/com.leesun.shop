'use strict'
const AccessService = require('../services/access.service')
const { CREATED, OK, SuccessReponse } = require('../core/success.response')
class AccessController{
    handlerRefreshToken = async(req, res, next) => {
        // new SuccessReponse({
        //     message: 'Get token success!',
        //     metadata: await AccessService.handlerRefreshToken(req.keyStore.refreshToken)
        // }).send(res)
        //v1
        new SuccessReponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenFixed({
                refreshToken: req.keyStore.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
    logout = async(req, res, next) => {
        new SuccessReponse({
            message: 'Logout success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login = async(req, res, next) => {
        new SuccessReponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async ( req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit:10
            }
        }).send(res)
        //return res.status(201).json(await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController()