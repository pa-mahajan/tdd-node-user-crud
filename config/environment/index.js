'use strict'

const _ = require('./../../dependencies')._;
const path = require('path');

let platformConfig = {
    env: process.env.NODE_ENV || 'development',
    allowedEnv: [
        'production',
        'development',
        'staging',
        'development-test',
        'staging-test'
    ]
};

let envConfig = require(path.join(__dirname,  platformConfig.env ));

module.exports = Object.assign({}, _.merge(platformConfig, envConfig));