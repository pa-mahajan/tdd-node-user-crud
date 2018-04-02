'use strict'

const config = require('./config/environment');

const db = require('./config/connections');
const middlewares = require('./middlewares');
const modules = require('./modules');
const applicationFramework = require('./applicationFramework');

const init = () => {
    _defineUnhandledException();
    _defineUnhandledRejection();
    let { app, router } = applicationFramework.init();
    db.init(); 
    modules.init(router);
    middlewares.init({app, router});
    initiateServer({ app: app });
}

const _defineUnhandledException = () => {
    process.on('uncaughtexception', (err) => {
        console.log('uncaught exception --> ', err);
    });
}

const _defineUnhandledRejection = () => {
    process.on('uncaughtrejection', (err) => {
        console.log('uncaught rejection --> ', err);
    });
}

const initiateServer = (params = {}) => {
    let  {
        app
    } = params;
    
    if(!app || !app.listen){
        throw('Invalid Arguments Passed'); 
    }

    app.listen(config.port);
}

module.exports = Object.assign({}, {
    init
});