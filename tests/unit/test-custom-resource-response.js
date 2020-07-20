'use strict'

const sinon = require('sinon')
const https = require('https')
const { expect } = require('chai')
const { PassThrough } = require('stream')
const { URL } = require('url')
const { CustomResourceResponse } = require('../../src')

const expected = {
  event: {
    physicalResourceId: 'xxx',
    requestId: 'xxx',
    stackId: 'xxx',
    logicalResourceId: 'xxx',
    responseUrl: 'https://localhost'
  },
  successResponse: {
    status: 'SUCCESS',
    reason: 'Success',
    data: {
      'xxx': 'yyy'
    }
  },
  failedResponse: {
    status: 'FAILED',
    reason: 'Error: failed test',
    data: null,
    error: new Error('failed test')
  }
}

describe('Test CustomResourceResponse class', () => {
  beforeEach(() => {
    this.httpsStub = sinon.stub(https, 'request')
  })

  afterEach(() => {
    this.httpsStub.restore()
  })

  it('Verifies response success', (done) => {
    const requestPassThrough = new PassThrough()
    const responsePassThrough = new PassThrough()
    this.httpsStub.callsFake((options, callback) => {
      const responseUrl = new URL(expected.event.responseUrl)
      const responseBody = JSON.stringify({
        Status: expected.successResponse.status,
        Reason: expected.successResponse.reason,
        PhysicalResourceId: expected.event.physicalResourceId,
        StackId: expected.event.stackId,
        RequestId: expected.event.requestId,
        LogicalResourceId: expected.event.logicalResourceId,
        Data: expected.successResponse.data
      })
      expect(options.hostname).to.eql(responseUrl.hostname)
      expect(options.path).to.eql(`${responseUrl.pathname}${responseUrl.search}`)
      expect(options.port).to.eql(443)
      expect(options.method).to.eql('PUT')
      expect(options.headers['content-length']).to.eql(responseBody.length)
      responsePassThrough.write(responseBody)
      responsePassThrough.end()
      callback(responsePassThrough)
      return requestPassThrough
    })
    const customResourceResponse = new CustomResourceResponse({
      'PhysicalResourceId': expected.event.physicalResourceId,
      'RequestId': expected.event.requestId,
      'StackId': expected.event.stackId,
      'LogicalResourceId': expected.event.logicalResourceId,
      'ResponseURL': expected.event.responseUrl
    })
    customResourceResponse.success(expected.successResponse.data)
    done()
  })

  it('Verifies response failed', (done) => {
    const requestPassThrough = new PassThrough()
    const responsePassThrough = new PassThrough()
    this.httpsStub.callsFake((options, callback) => {
      const responseUrl = new URL(expected.event.responseUrl)
      const responseBody = JSON.stringify({
        Status: expected.failedResponse.status,
        Reason: expected.failedResponse.reason,
        PhysicalResourceId: expected.event.physicalResourceId,
        StackId: expected.event.stackId,
        RequestId: expected.event.requestId,
        LogicalResourceId: expected.event.logicalResourceId,
        Data: expected.failedResponse.data
      })
      expect(options.hostname).to.eql(responseUrl.hostname)
      expect(options.path).to.eql(`${responseUrl.pathname}${responseUrl.search}`)
      expect(options.port).to.eql(443)
      expect(options.method).to.eql('PUT')
      expect(options.headers['content-length']).to.eql(responseBody.length)
      responsePassThrough.write(responseBody)
      responsePassThrough.end()
      callback(responsePassThrough)
      return requestPassThrough
    })
    const customResourceResponse = new CustomResourceResponse({
      'PhysicalResourceId': expected.event.physicalResourceId,
      'RequestId': expected.event.requestId,
      'StackId': expected.event.stackId,
      'LogicalResourceId': expected.event.logicalResourceId,
      'ResponseURL': expected.event.responseUrl
    })
    customResourceResponse.failed(expected.failedResponse.error)
    done()
  })
})
