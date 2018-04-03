'use strict'

const sinon = require('sinon');
const should = require('chai').should();
const rewire = require('rewire');

const index = rewire('./index');
const mongodb = require('./mongodb');
const config = require('./../environment');

describe('Connections --> ', () => {
    describe('Index --> ', () => {
        
        let sandbox;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });
        
        afterEach(() => {
            sandbox.restore();
        });
        
        describe('init function --> ', () => {
    
            let getDatabaseConfigStub;
            let getDatabaseConfig_orignal;
            let mongodbInitStub;
            
            beforeEach(() => {
                getDatabaseConfigStub = sinon.stub();
                getDatabaseConfig_orignal = index.__get__('getDatabaseConfig');
                index.__set__('getDatabaseConfig', getDatabaseConfigStub);
                getDatabaseConfigStub.returns([]);

                mongodbInitStub = sinon.stub(mongodb, 'init');
            });
            
            afterEach(() => {
                index.__set__('getDatabaseConfig', getDatabaseConfig_orignal);
                mongodbInitStub.restore();
            });

            it('should get all configurations for connections just once', () => {
                index.__get__('init')();
                getDatabaseConfigStub.callCount.should.be.equal(1);
            });

            it('shoul not inititatedatabase connection if connfiguration connect is false', () => {
                getDatabaseConfigStub.returns([{
                    database: 'mongodb',
                    connect: false
                }]);

                index.__get__('init')();
                mongodbInitStub.callCount.should.be.equal(0);
            });

            it('should not inititatedatabase connection if connfiguration connect is true', () => {
                getDatabaseConfigStub.returns([{
                    database: 'mongodb',
                    connect: true
                }]);

                index.__get__('init')();
                mongodbInitStub.callCount.should.be.equal(1);
            });
        });

        describe('getDatabaseConfig function --> ', () => {
            it('should return config defined in application configurations', () => {
                let allConfigs = index.__get__('getDatabaseConfig')();
                should.exist(allConfigs);
                allConfigs.should.be.deep.equal(config.database);
            });
        });
    })
});
