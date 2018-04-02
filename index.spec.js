'use strict'

const chai = require('chai');
const should = chai.should();
const config = require('./config/environment');
const sinon = require('sinon');
const rewire = require('rewire');
const index = rewire('./index');
const app = require('./app');

describe('index.js', () => {
    describe('Index.js --> Responsible for overall server specific initializing tasks ', () => {
        describe('private functions --> ', () => {
            describe('_isEnvironmentValid function --> ', () => {
                it('should return true if correct envronment variable is passed', () => {
                    let env = 'development';
                    let result = index.__get__('_isEnvironmentValid')(env);
                    result.should.be.true;
                });

                it('should return fasle if incorrect environment variable is passed', () => {
                    let env = 'invalid env';
                    let result = index.__get__('_isEnvironmentValid')(env);
                    result.should.be.false
                });
            });

            describe('_init function --> ', () => {
                let _isEnvironmentValidStub;
                let appInitStub;
                beforeEach(() => {
                    _isEnvironmentValidStub = sinon.stub();
                    index.__set__('_isEnvironmentValid', _isEnvironmentValidStub);
                    appInitStub = sinon.stub(app, 'init');
                })

                afterEach(() => {
                    appInitStub.restore();
                })

                it('should call _isEnvironmentValid just once', () => {
                    _isEnvironmentValidStub.returns(true);
                    index.__get__('_init')();
                    _isEnvironmentValidStub.callCount.should.be.equal(1);
                });

                it('should throw error if invalid envrionment is passed', () => {
                    _isEnvironmentValidStub.returns(false);
                    index.__get__('_init').should.throw('Invalid Environment');
                })

                it('should not throw an error if correct environment is passed', () => {
                    _isEnvironmentValidStub.returns(true);
                    index.__get__('_init').should.not.throw('Invalid Environment');
                });

                it('initiates aplication server if valid environment is passed', () => {
                    _isEnvironmentValidStub.returns(true);
                    index.__get__('_init')();
                    appInitStub.callCount.should.be.equal(1);
                })
            });
        });
    });
});
