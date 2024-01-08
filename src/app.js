require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default:helmet} = require('helmet')
const compression = require('compression')
//var bodyParser = require('body-parser');
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//init db
require('./dbs/init.mongodb')
// const {checkOverLoad} = require('./helpers/check.connect')
//checkOverLoad()
//init routes
app.use('', require('./routers'))

//handling error




module.exports = app