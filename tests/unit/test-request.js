'use strict'

const { expect } = require('chai')
const { Request } = require('../../src')
const { range, shuffle } = require('lodash')

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

  it('Verifies request get file', async() => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    const filename = 'file'
    const expectedContent = Buffer.from(
      shuffle(
        range(0, 255)
      )
    )
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${filename}"; filename="test.txt"\r\nContent-Type: "application/protobuf"\r\n\r\n`),
      expectedContent,
      Buffer.from(`\r\n--${boundary}--`)
    ]).toString('base64')
    const request = new Request({
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`
      },
      body: body,
      isBase64Encoded: true
    })
    const image = await request.file(filename)
    expect(image).to.eql(expectedContent)
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

  it('Verifies request validate success', (done) => {
    const expectedData = {
      name: 'John',
      description: 'This is a John'
    }
    const request = new Request({
      body: JSON.stringify(expectedData)
    })
    const validated = request.validate(joi => {
      return {
        name: joi.string().required(),
        description: joi.string().required()
      }
    })
    expect(validated.error).to.equal(false)
    done()
  })

  it('Verifies request validate failure', (done) => {
    const request = new Request()
    const validated = request.validate(joi => {
      return {
        name: joi.string().required(),
        description: joi.string().required()
      }
    })
    expect(validated.error).to.equal(true)
    expect(validated.messages).to.be.an('object')
    expect(validated.messages.name).to.be.an('string')
    expect(validated.messages.description).to.be.an('string')
    done()
  })

  it('Verifies request validateAsync success', async() => {
    const expectedData = {
      name: 'John',
      description: 'This is a John'
    }
    const request = new Request({
      body: JSON.stringify(expectedData)
    })
    try {
      const validated = await request.validateAsync(joi => {
        return {
          name: joi.string().required(),
          description: joi.string().required()
        }
      })
      expect(validated.name).to.equal(expectedData.name)
      expect(validated.description).to.equal(expectedData.description)
    } catch (error) {}
  })

  it('Verifies request validateAsync failure', async() => {
    const request = new Request()
    try {
      await request.validateAsync(joi => {
        return {
          name: joi.string().required(),
          description: joi.string().required()
        }
      })
    } catch (error) {
      expect(error.name).to.be.an('string')
      expect(error.description).to.be.an('string')
    }
  })
})
