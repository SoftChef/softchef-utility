'use strict'

const { expect } = require('chai')
const Joi = require('../../src/validator')

describe('Test Validator class', () => {
    it('Verifies validate semantic version success', (done) => {
        const result = Joi.object().keys({
            version: Joi.string().semanticVersion().required()
        }).validate({
            version: '1.0.0'
        })
        expect(result.error).to.be.an('null')
        done()
    })

    it('Verifies validate semantic version failed', (done) => {
        const result = Joi.object().keys({
            version: Joi.string().semanticVersion().required()
        }).validate({
            version: 'v1'
        })
        expect(result.error).to.not.an('null')
        done()
    })
})
