'use strict'
const mongoose = require('mongoose')
const {db:{host,port,name}} =  require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
const {countConnect} = require('../helpers/check.connect')


class DataBase{
    constructor(){
        this.connect()
    }
    //connect
    connect(type='mongodb'){
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color:true})
        }
        mongoose.connect(connectString,{
            maxPoolSize:50
        }).then(()=> {
            console.log(`Connected Mongodb Success`,countConnect())
        })
        .catch(err=> console.log(`Error Connect!`))
    }
    static getInstance(){
        if(!DataBase.instance){
            DataBase.instance = new DataBase()
        }
        return DataBase.instance
    }
}

const instanceMongodb = DataBase.getInstance();
module.exports = instanceMongodb