'use strict'

const AWS = require('aws-sdk')
const Busboy = require('busboy')
const Joi = require('./validator')
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

class Request {
  constructor(event) {
    this.event = event || {}
    this.headers = this.event.headers || {}
    this.isMultipartFormData = /^multipart\/form-data.*$/.test(this.headers['Content-Type'] || this.headers['content-type'])
    this.parameters = this.event.pathParameters || {}
    this.query = this.event.queryStringParameters || {}
    this.body = {}
    this.files = {}
    try {
      if (this.isMultipartFormData) {
        this.busboy = new Busboy({
          headers: {
            'content-type': this.headers['Content-Type'] || this.headers['content-type']
          }
        })
      } else if (typeof this.event.body === 'string') {
        this.body = JSON.parse(this.event.body) || {}
      } else if (typeof this.event.body === 'object') {
        this.body = this.event.body || {}
      } else {
        this.body = {}
      }
    } catch (error) {
      this.body = {}
    }
  }
  parameter(key) {
    let parameter = this.parameters[key] || null
    if (parameter) {
      parameter = decodeURI(parameter)
    }
    return parameter
  }
  get(key, defaultValue = null) {
    let result = this.query[key]
    if (result === undefined) {
      result = defaultValue
    }
    return result
  }
  input(key, defaultValue = null) {
    let result = this.body[key]
    if (result === undefined) {
      result = this.query[key] || defaultValue
    }
    return result
  }
  inputs(keys) {
    const inputs = {}
    for (let key of keys) {
      let input = this.input(key)
      if (input === undefined) {
        input = this.get(key)
      }
      inputs[key] = input
    }
    return inputs
  }
  has(key) {
    if (this.query[key] !== undefined) {
      return true
    } else if (this.body[key] !== undefined) {
      return true
    }
    return false
  }
  async file(key) {
    if (!this.busboy._finished) {
      await this._processFiles()
    }
    return Promise.resolve(this.files[key].binary || null)
  }
  headers() {
    return this.event.headers
  }
  header(key) {
    return this.event.headers[key] || null
  }
  async user(attribute) {
    const requestContext = this.event.requestContext || {}
    let user
    if (requestContext.authorizer) {
      const authorizer = requestContext.authorizer || {}
      const claims = authorizer.claims || {}
      const identity = authorizer.identity || 'default'
      if (typeof claims === 'string') {
        user = JSON.parse(claims)
      } else {
        user = claims
      }
      user.identity = identity
      user.username = user['cognito:username'] || user.sub
      if (attribute) {
        return user[attribute] || null
      } else {
        return user
      }
    } else {
      try {
        const identity = requestContext.identity || {}
        const authProvider = identity.cognitoAuthenticationProvider || {}
        if (/^.*,[\w\.-]*\/(.*):.*:(.*)/.test(authProvider)) {
          const [origin, userPoolId, userSub] = authProvider.match(/^.*,[\w\.-]*\/(.*):.*:(.*)/)
          user = await this._getUser(userPoolId, userSub)
          return user
        }
      } catch (error) {
        return error
      }
    }
  }

  validate(keysProvider, options = {}) {
    const keys = keysProvider(Joi)
    const schema = Joi.object().keys(keys)
    const result = schema.validate(
      this.inputs(
        Object.keys(keys)
      ),
      {
        abortEarly: false,
        ...options
      }
    )
    if (result.error) {
      let messages = {}
      for (let error of result.error.details) {
        messages[error.context.key] = error.message
      }
      return {
        error: true,
        messages
      }
    }
    return {
      error: false
    }
  }

  async validateAsync(keysProvider, options = {}) {
    try {
      const keys = keysProvider(Joi)
      const schema = Joi.object().keys(keys)
      const validated = await schema.validateAsync(
        this.inputs(
            Object.keys(keys)
        ),
        {
          abortEarly: false,
          ...options
        }
      )
      return Promise.resolve(validated)
    } catch (error) {
      const errors = {}
      for (const detail of error.details) {
        errors[detail.context.key] = detail.message
      }
      return Promise.reject(errors)
    }
  }

  async _getUser(userPoolId, userSub) {
    try {
      const user = await cognitoIdentityServiceProvider.adminGetUser({
        UserPoolId: userPoolId,
        Username: userSub
      }).promise()
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  _processFiles() {
    return new Promise((resolve, reject) => {
      try {
        this.busboy.on('field', (fieldName, value, fieldNameTruncated, valTruncated) => {
          this.body[fieldName] = value
        })
        this.busboy.on('file', (fieldName, file, filename, encoding, mimeType) => {
          if (!this.files[fieldName]) {
            this.files[fieldName] = {
              binary: Buffer.from(''),
              filename,
              encoding,
              mimeType
            }
          }
          file.on('data', (data) => {
            this.files[fieldName].binary = Buffer.concat([this.files[fieldName].binary, data])
          })
          file.on('end', () => {})
        })
        this.busboy.on('error', error => {
          return reject(
            new Error(`Parse error: ${error}`)
          )
        })
        this.busboy.on('finish', () => {
          resolve(true)
        })
        this.busboy.write(this.event.body, this.event.isBase64Encoded ? 'base64' : 'binary')
        this.busboy.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = Request
