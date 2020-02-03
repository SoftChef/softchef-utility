'use strict'

const { expect } = require('chai')
const { Request } = require('../../src')

describe('Test Request class', () => {
    it('Verifies request get parameter', (done) => {
        const request = new Request({
            pathParameters: {
                id: '123'
            }
        })
        expect(request.parameter('id')).to.equal('123')
        done()
    })

    it('Verifies request get query', (done) => {
        const request = new Request({
            queryStringParameters: {
                search: 'hello'
            }
        })
        expect(request.get('search')).to.equal('hello')
        expect(request.get('keyword', 'nodejs')).to.equal('nodejs')
        done()
    })

    it('Verifies request get input', (done) => {
        const request = new Request({
            body: '{"name":"John"}'
        })
        expect(request.input('name')).to.equal('John')
        expect(request.input('age', 18)).to.equal(18)
        done()
    })

    it('Verifies request has key', (done) => {
        const request = new Request({
            queryStringParameters: {
                search: 'hello'
            },
            body: '{"name":"John"}'
        })
        expect(request.has('search')).to.equal(true)
        expect(request.has('name')).to.equal(true)
        expect(request.has('xxx')).to.equal(false)
        done()
    })
})
