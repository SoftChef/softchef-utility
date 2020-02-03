'use strict'

const { expect } = require('chai')
const { Response } = require('../../src')

const expectJsonData = {
    'data': 1
}
const expectJsonErrorData = {
    'error': 'error'
}
const expectErrorMessage = 'error message'

describe('Test Response class', () => {
    it('Verifies response json success', (done) => {
        const response = new Response()
        let responseSuccess = response.json(expectJsonData)
        expect(responseSuccess.statusCode).to.equal(200)
        expect(responseSuccess.body).to.equal(JSON.stringify(expectJsonData))
        done()
    })

    it('Verifies response json error', (done) => {
        const response = new Response()
        let responseError = response.json(expectJsonErrorData, 422)
        expect(responseError.statusCode).to.equal(422)
        expect(responseError.body).to.equal(JSON.stringify(expectJsonErrorData))
        done()
    })

    it('Verifies response error', (done) => {
        const response = new Response()
        let responseError = response.error(expectErrorMessage, 500)
        expect(responseError.statusCode).to.equal(500)
        expect(responseError.body).to.equal(JSON.stringify({
            error: expectErrorMessage
        }))
        done()
    })

    it('Verifies response not found', (done) => {
        const response = new Response()
        let responseNotFound = response.notFound()
        expect(responseNotFound.statusCode).to.equal(404)
        done()
    })

    it('Verifies response has cors', (done) => {
        const response = new Response()
        response.setCors(true)
        let responseSuccess = response.json({}, 200)
        expect(responseSuccess.headers).to.ownProperty('Access-Control-Allow-Origin')
        expect(responseSuccess.headers).to.ownProperty('Access-Control-Allow-Headers')
        expect(responseSuccess.headers).to.ownProperty('Access-Control-Allow-Methods')
        done()
    })

    it('Verifies response not cors', (done) => {
        const response = new Response()
        response.setCors(false)
        let responseSuccess = response.json({}, 200)
        expect(responseSuccess.headers).to.not.ownProperty('Access-Control-Allow-Origin')
        expect(responseSuccess.headers).to.not.ownProperty('Access-Control-Allow-Headers')
        done()
    })
})
