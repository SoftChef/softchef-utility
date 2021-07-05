'use strict'

const { expect } = require('chai')
const Joi = require('../../src/validator')

describe('Test Validator class', () => {
  it('Verifies validate aws region success', (done) => {
    const expectedData = {
      awsRegion: 'ap-northeast-1'
    }
    const result = Joi.object().keys({
      awsRegion: Joi.awsRegion().required()
    }).validate(expectedData)
    expect(result.value).to.eql(expectedData)
    done()
  })

  it('Verifies validate aws region failure', (done) => {
    const result = Joi.object().keys({
      awsRegion: Joi.awsRegion().required()
    }).validate({
      awsRegion: 'eu-west-1'
    })
    expect(result.error.toString()).to.be.an('string')
    done()
  })

  it('Verifies validate semantic version success', (done) => {
    const expectedData = {
      version: '1.0.0'
    }
    const result = Joi.object().keys({
      version: Joi.semanticVersion().required()
    }).validate(expectedData)
    expect(result.value).to.eql(expectedData)
    done()
  })

  it('Verifies validate semantic version failed', (done) => {
    const result = Joi.object().keys({
      version: Joi.semanticVersion().required()
    }).validate({
      version: 'v1'
    })
    expect(result.error).to.not.an('null')
    done()
  })

  it('Verifies validate date format success', (done) => {
    const expectedData = {
      date: '2019-01-01'
    }
    const result = Joi.object().keys({
      date: Joi.date().format('YYYY-MM-DD').raw().required()
    }).validate(expectedData)
    expect(result.value).to.eql(expectedData)
    done()
  })
})
