'use strict'

const { helmet } = require('./../dependencies');

const init = function (params = {}) {
    let {
        app,
        router
    } = params;

    if(!app)
        throw('Invalid Arguments Passed');

    app.use(helmet.init());

    if(router) app.use(router);
}

module.exports = Object.assign({}, {
    init
})
