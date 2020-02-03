'use strict'

const sinon = require('sinon')
const https = require('https')
const { PassThrough } = require('stream')
const { expect } = require('chai')
const { Miap } = require('../../src')

const expected = {
    customerApplication: {
        id: 'xxx',
        token: 'yyy',
        accountId: '123456789012',
        region: 'us-east-1',
        appName: 'unit-test-app',
        appId: 'unit-test-app-id',
        notificationEmail: 'dev@softchef.com'
    }
}

describe('Test Miap class', () => {
    // beforeEach(async() => {
    //     this.httpsStub = sinon.stub(https, 'request')
    // })

    // afterEach(async() => {
    //     this.httpsStub.restore()
    // })

    // it('Verifies register function', async() => {
    //     const requestPassThrough = new PassThrough()
    //     const responsePassThrough = new PassThrough()
    //     this.httpsStub.callsFake((options, callback) => {
    //         expect(options.hostname).to.equal('localhost')
    //         expect(options.path).to.equal('/applications/register')
    //         expect(options.method).to.equal('POST')
    //         responsePassThrough.write(
    //             JSON.stringify({
    //                 token: expected.customerApplication.token
    //             })
    //         )
    //         responsePassThrough.end()
    //         callback(responsePassThrough)
    //         return requestPassThrough
    //     })
    //     const miap = new Miap()
    //     const result = await miap.register({
    //         accountId: expected.customerApplication.accountId,
    //         region: expected.customerApplication.region,
    //         appId: expected.customerApplication.appId,
    //         appName: expected.customerApplication.appName,
    //         notificationEmail: expected.customerApplication.notificationEmail
    //     })
    //     expect(result.token).to.equal(expected.customerApplication.token)
    // })

    // it('Verifies unregister function', async() => {
    //     const requestPassThrough = new PassThrough()
    //     const responsePassThrough = new PassThrough()
    //     this.httpsStub.callsFake((options, callback) => {
    //         expect(options.hostname).to.equal('localhost')
    //         expect(options.path).to.equal('/applications/unregister')
    //         expect(options.method).to.equal('DELETE')
    //         responsePassThrough.write(
    //             JSON.stringify({
    //                 unregister: true
    //             })
    //         )
    //         responsePassThrough.end()
    //         callback(responsePassThrough)
    //         return requestPassThrough
    //     })
    //     const miap = new Miap()
    //     const result = await miap.unregister({
    //         token: expected.customerApplication.token
    //     })
    //     expect(result.unregister).to.equal(true)
    // })
})
