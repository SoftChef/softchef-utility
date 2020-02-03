'use strict'

const Joi = require('./validator')

class Request {
    constructor(event) {
        this.event = event || {}
        this.parameters = this.event.pathParameters || {}
        this.query = this.event.queryStringParameters || {}
        try {
            if (typeof this.event.body === 'string') {
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
    headers() {
        return this.event.headers
    }
    header(key) {
        return this.event.headers[key] || null
    }
    user(attribute) {
        const requestContext = this.event.requestContext || {}
        const authorizer = requestContext.authorizer || {}
        const claims = authorizer.claims || {}
        const identity = authorizer.identity || 'default'
        let user
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
    }
    validate(keysProvider) {
        const keys = keysProvider(Joi)
        const schema = Joi.object().keys(keys)
        const result = schema.validate(
            this.inputs(
                Object.keys(keys)
            )
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
}

module.exports = Request
