'use strict'

const should = require('chai').should();

const index = require('./index');

describe('application framework', () => {
    it('should return required keys', () => {
        let requiredKey = ['app', 'router'];
        let result = index.init();
        should.exist(result);
        Object.keys(result).should.be.deep.equal(requiredKey);
        result[requiredKey[0]].should.not.be.deep.equal({});
    })
});