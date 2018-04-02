'use strict'

let _ = require('lodash');

const indexOf = function (arr, value, optIndex) {
    return _.indexOf(arr, value, optIndex);
}

const merge = function (obj1, obj2) {
    return _.merge(obj1, obj2);
}

module.exports = Object.assign({}, {
    indexOf,
    merge
});