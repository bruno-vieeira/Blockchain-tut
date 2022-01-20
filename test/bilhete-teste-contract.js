/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { BilheteTesteContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('BilheteTesteContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new BilheteTesteContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"bilhete teste 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"bilhete teste 1002 value"}'));
    });

    describe('#bilheteTesteExists', () => {

        it('should return true for a bilhete teste', async () => {
            await contract.bilheteTesteExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a bilhete teste that does not exist', async () => {
            await contract.bilheteTesteExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createBilheteTeste', () => {

        it('should create a bilhete teste', async () => {
            await contract.createBilheteTeste(ctx, '1003', 'bilhete teste 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"bilhete teste 1003 value"}'));
        });

        it('should throw an error for a bilhete teste that already exists', async () => {
            await contract.createBilheteTeste(ctx, '1001', 'myvalue').should.be.rejectedWith(/The bilhete teste 1001 already exists/);
        });

    });

    describe('#readBilheteTeste', () => {

        it('should return a bilhete teste', async () => {
            await contract.readBilheteTeste(ctx, '1001').should.eventually.deep.equal({ value: 'bilhete teste 1001 value' });
        });

        it('should throw an error for a bilhete teste that does not exist', async () => {
            await contract.readBilheteTeste(ctx, '1003').should.be.rejectedWith(/The bilhete teste 1003 does not exist/);
        });

    });

    describe('#updateBilheteTeste', () => {

        it('should update a bilhete teste', async () => {
            await contract.updateBilheteTeste(ctx, '1001', 'bilhete teste 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"bilhete teste 1001 new value"}'));
        });

        it('should throw an error for a bilhete teste that does not exist', async () => {
            await contract.updateBilheteTeste(ctx, '1003', 'bilhete teste 1003 new value').should.be.rejectedWith(/The bilhete teste 1003 does not exist/);
        });

    });

    describe('#deleteBilheteTeste', () => {

        it('should delete a bilhete teste', async () => {
            await contract.deleteBilheteTeste(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a bilhete teste that does not exist', async () => {
            await contract.deleteBilheteTeste(ctx, '1003').should.be.rejectedWith(/The bilhete teste 1003 does not exist/);
        });

    });

});
