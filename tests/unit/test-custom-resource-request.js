'use strict'

const { expect } = require('chai')
const { CustomResourceRequest } = require('../../src')

const expected = {
  requestType: 'create',
  resourceProperties: {
    accountId: '123456789',
    region: 'xxx',
    appName: 'xxx'
  }
}

describe('Test CustomResourceRequest class', () => {
  it('Verifies get request type', (done) => {
    const customResourceRequest = new CustomResourceRequest({
      'RequestType': expected.requestType,
      'ResourceProperties': expected.resourceProperties
    })
    expect(customResourceRequest.requestType()).to.eql(expected.requestType)
    expect(customResourceRequest.on('create')).to.eql(true)
    expect(customResourceRequest.on('delete')).to.eql(false)
    expect(customResourceRequest.on(['create', 'update'])).to.eql(true)
    done()
  })

  it('Verifies get property', (done) => {
    const customResourceRequest = new CustomResourceRequest({
      'RequestType': expected.requestType,
      'ResourceProperties': expected.resourceProperties
    })
    expect(customResourceRequest.properties()).to.eql(expected.resourceProperties)
    expect(customResourceRequest.property('accountId')).to.eql(expected.resourceProperties.accountId)
    expect(customResourceRequest.property('region')).to.eql(expected.resourceProperties.region)
    expect(customResourceRequest.property('appName')).to.eql(expected.resourceProperties.appName)
    done()
  })
})
