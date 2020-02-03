'use strict'

const Joi = require('@hapi/joi')
const semver = require('semver')

const allowAwsRegion = [
    'ap-northeast-1',
    'ap-southeast-1'
]

module.exports = Joi
    .extend(joi => ({
        base: joi.string(),
        name: 'string',
        language: {
            awsRegion: `isn't allow AWS region`
        },
        rules: [
            {
                name: 'awsRegion',
                validate(parameters, value, state, options) {
                    if (allowAwsRegion.indexOf(value) > -1) {
                        return value
                    } else {
                        return this.createError('string.awsRegion', {
                            v: value, q: parameters.q
                        }, state, options)
                    }
                }
            }
        ]
    }))
    .extend(joi => ({
        base: joi.string(),
        name: 'string',
        language: {
            semanticVersion: `isn't semantic version format`
        },
        rules: [
            {
                name: 'semanticVersion',
                validate(parameters, value, state, options) {
                    if (semver.valid(value)) {
                        return value
                    } else {
                        return this.createError('string.semanticVersion', {
                            v: value, q: parameters.q
                        }, state, options)
                    }
                }
            }
        ]
    }))

// You can extend Joi after extend()
// example: Joi.extend(...).extend(...).extend(...)
