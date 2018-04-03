'use strict'

const  mongodb = require('./mongodb');
const config = require('./../environment');

const init = () => {
    let config = getDatabaseConfig();
    config.forEach(dbConfig => {
        switch(dbConfig.database){
            case 'mongodb':
                if (dbConfig.connect)  mongodb.init(dbConfig);  
            break;
        }     
    });
}

const getDatabaseConfig = () => {
    let databaseConfig = config.database ?  config.database : [];
    return databaseConfig;
}

module.exports = Object.assign({} , {
    init
})