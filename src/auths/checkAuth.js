'use strict'

const { findKeyById } = require("../services/api.key.service")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async(req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // check objKey
        const objKey = await findKeyById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error(!=null)'
            })
        }
        req.objKey = objKey
        return next()
    } catch(error){

    }
}
const permission = (permission) => {
    return (req, res, next) =>{
        if (req.objKey.permission) {
            return res.status(403).json({
                message: 'Permission dined!'
            })
        }
        console.log('permission::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'Permission do not valid!'
            })
        }
        console.log('check permission done!');
        return next()
    }
}
module.exports = {
    apiKey,
    permission,
}