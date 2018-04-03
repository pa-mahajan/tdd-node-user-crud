'use strict'

let applicationConfig = {
    'port': 3000,
    'database': [{
        database: 'mongodb',
        connect: false
    }]
} 

module.exports = Object.assign({}, applicationConfig);