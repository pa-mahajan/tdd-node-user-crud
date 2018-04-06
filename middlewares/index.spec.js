'use strict'

const index = require('./index');
const should = require('chai').should();
const sinon = require('sinon');
const { helmet } = require('./../dependencies');

describe('Middlewares --> ', () => {
    let sandbox;
    
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('index.js --> ', () => {
        describe('init function --> ', () => {
            let helmetInitStub;

            beforeEach(() => {
                helmetInitStub = sandbox.stub(helmet, 'init');
            });

            it('should throw an exception if app is not provided', () => {
                let  init = index.init;
                init.should.throw('Invalid Arguments Passed');
            });

            it('should define middleware for halmet', () => {
                helmetInitStub.returns();
                index.init({
                    app: {
                        use: () => {

                        }
                    }
                });

                helmetInitStub.callCount.should.be.equal(1);
            });

            it('should define router middleware if it is passed as an argument', () => {
                let appUseStub = sandbox.stub();
                index.init({
                    app: {
                        use: appUseStub
                    }, router: {}
                });
                appUseStub.callCount.should.be.equal(2);
            })
        });
    })
})

