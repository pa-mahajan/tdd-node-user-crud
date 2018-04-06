'use strict'

const { express } = require('./../dependencies');

const init = () => {
    let app = express();
    const router = express.Router();

    return {
        app,
        router
    }
}

module.exports = Object.assign({}, {
    init
})