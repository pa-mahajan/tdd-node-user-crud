'use strict'

const chai = require('chai');
const should = chai.should();
const rewire = require('rewire');
const sinon = require('sinon');
const config = require('./config/environment');

const app = rewire('./app');
const dbConnections = require('./config/connections');
const middlewares = require('./middlewares');
const modules = require('./modules');
const applicationFramework = require('./applicationFramework');


describe('app.js', () => {
    let sandbox;
    
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });
    
    describe('init function -->', () => {
        let _defineUnhandledExceptionStub;
        let _defineUnhandledException_original;

        let _defineUnhandledRejectionStub;
        let _defineUnhandledRejection_original;

        let dbInitStub;
        let middlewaresStub;
        let modulesStub;
        let applicationFrameworkStub;
        let initiateServerStub;
        let initiateServer_original;

        beforeEach(() => {
            _defineUnhandledExceptionStub = sandbox.stub()
            _defineUnhandledException_original = app.__get__('_defineUnhandledException');
            app.__set__('_defineUnhandledException', _defineUnhandledExceptionStub);

            _defineUnhandledRejectionStub = sandbox.stub();
            _defineUnhandledRejection_original = app.__get__('_defineUnhandledRejection');
            app.__set__('_defineUnhandledRejection', _defineUnhandledRejectionStub);

            dbInitStub = sandbox.stub(dbConnections, 'init');

            middlewaresStub = sandbox.stub(middlewares, 'init');
            
            modulesStub = sandbox.stub(modules, 'init');

            applicationFrameworkStub = sandbox.stub(applicationFramework, 'init');
            applicationFrameworkStub.returns({
                app: {},
                router: {}
            })
            
            initiateServerStub = sandbox.stub();
            initiateServer_original = app.__get__('initiateServer');
            app.__set__('initiateServer', initiateServerStub);
        });

        afterEach( () => {
            app.__set__('_defineUnhandledException', _defineUnhandledException_original);
            app.__set__('_defineUnhandledRejection', _defineUnhandledRejection_original); 
            app.__set__('initiateServer', initiateServer_original);           
        })

        it('should define unhandled exceptions only once', () => {
            app.init();
            _defineUnhandledExceptionStub.callCount.should.be.equal(1);
        });

        it('should define unhandled rejections only once', () => {
            app.init();
            _defineUnhandledExceptionStub.callCount.should.be.equal(1);
        });

        it('inititate database connections according to config only once', () => {
            app.init();
            dbInitStub.callCount.should.be.equal(1);
        });

        it('should start requiring my application modules/features and pass router as first argument', () => {
            applicationFrameworkStub.returns({
                app: {
                    data: ''
                },
                router: {
                    a: '123'
                }
            });
            app.init();
            modulesStub.callCount.should.be.equal(1)
            modulesStub.firstCall.args.should.be.deep.equal([{ a: '123'}]);
        });
        
        it('should start requiring my application middlewares', () => {
            app.init();
            middlewaresStub.callCount.should.be.equal(1);
        });

        it('should pass app and router to application middleware as arguments', () => {
            applicationFrameworkStub.returns({
                app: {
                    data: ''
                },
                router: {
                    a: '123'
                }
            })

            app.init();
            middlewaresStub.firstCall.args.should.be.deep.equal([{ app: { data: '' }, router: { a: '123' }}]);
        });

        it('should require application framework layer', () => {
            
            app.init();
            applicationFrameworkStub.callCount.should.be.equal(1);
        })
        
        it('should initiate server', () => {
            app.init();
            initiateServerStub.callCount.should.be.equal(1);
        });

        it('should provide app as a first argument', () => {
            app.init();
            initiateServerStub.firstCall.args[0].should.have.property('app')
        })
    }); 

    describe('_defineUnhandledException function --> ', () => {
        it('should trigger uncaught exception handling event just once', () => {
            let processSpy = sinon.spy(process, 'on');
            app.__get__('_defineUnhandledException')();
            processSpy.callCount.should.be.equal(1);
            processSpy.restore();
        });
    });

    describe('_defineUnhandledRejection function --> ', () => {
        it('should trigger uncaught reject handling event just once', () => {
            let processSpy = sinon.spy(process, 'on');
            app.__get__('_defineUnhandledRejection')();
            processSpy.callCount.should.be.equal(1);
            processSpy.restore();
        })
    })

    describe('initiateServer function --> ', () => {
        it('should throw an error if invalid app is not provided as an argument', () => {
            let  initiateServer = app.__get__('initiateServer');
            initiateServer.should.throw('Invalid Arguments Passed');
        })

        it('should throw an error if listen is not a method in app', () => {
            let initiateServer = app.__get__('initiateServer').bind(this, { app: { message: 'hey! there is no start'} });
            initiateServer.should.throw('Invalid Arguments Passed');
        });

        it('should not throw error if correct data is passed', () => {
            let initiateServer = app.__get__('initiateServer').bind(this, { app: { listen: () => {} } });
            initiateServer.should.not.throw('Invalid Arguments Passed');
        })
        it('should inititate server at port defined in config', () => {
            let appListenStub = sandbox.stub();
            app.__get__('initiateServer')({
                app: {
                    listen: appListenStub
                }
            });

            appListenStub.callCount.should.be.equal(1);
            appListenStub.firstCall.args.should.be.deep.equal([config.port]);
        });
    })
})