'use strict'

const config = require('./config/environment');
const _ = require('./dependencies')._;
const app = require('./app');

const currentEnv = process.env.NODE_ENV;

const _isEnvironmentValid = (env) => {
    return _.indexOf(config.allowedEnv, env) !== -1;
}

const _init =  () => {
    const env = config.env;
    if(_isEnvironmentValid(env) == false)   
        throw('Invalid Environment');
    app.init();
}

_init()