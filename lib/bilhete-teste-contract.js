/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BilheteTesteContract extends Contract {

    async bilheteTesteExists(ctx, bilheteTesteId) {
        const buffer = await ctx.stub.getState(bilheteTesteId);
        return (!!buffer && buffer.length > 0);
    }

    async createBilheteTeste(ctx, bilheteTesteId, value) {
        const exists = await this.bilheteTesteExists(ctx, bilheteTesteId);
        if (exists) {
            throw new Error(`The bilhete teste ${bilheteTesteId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(bilheteTesteId, buffer);
    }

    async readBilheteTeste(ctx, bilheteTesteId) {
        const exists = await this.bilheteTesteExists(ctx, bilheteTesteId);
        if (!exists) {
            throw new Error(`The bilhete teste ${bilheteTesteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(bilheteTesteId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateBilheteTeste(ctx, bilheteTesteId, newValue) {
        const exists = await this.bilheteTesteExists(ctx, bilheteTesteId);
        if (!exists) {
            throw new Error(`The bilhete teste ${bilheteTesteId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(bilheteTesteId, buffer);
    }

    async deleteBilheteTeste(ctx, bilheteTesteId) {
        const exists = await this.bilheteTesteExists(ctx, bilheteTesteId);
        if (!exists) {
            throw new Error(`The bilhete teste ${bilheteTesteId} does not exist`);
        }
        await ctx.stub.deleteState(bilheteTesteId);
    }

}

module.exports = BilheteTesteContract;
