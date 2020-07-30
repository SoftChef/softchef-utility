'use strict'

const Joi = require('@hapi/joi')
const semver = require('semver')

const ALLOW_AWS_REGIONS = [
  'ap-northeast-1',
  'ap-southeast-1'
]

module.exports = Joi
  .extend(joi => {
    return {
      type: 'awsRegion',
      base: joi.string(),
      messages: {
        'awsRegion.base': `isn't allow AWS region`
      },
      validate(value, helpers) {
        if (ALLOW_AWS_REGIONS.indexOf(value) === -1) {
          return {
            value,
            errors: helpers.error('awsRegion.base')
          }
        }
      }
    }
  })
  .extend(joi => {
    return {
      type: 'semanticVersion',
      base: joi.string(),
      messages: {
        'semanticVersion.base': `isn't semantic version format`
      },
      validate(value, helpers) {
        if (!semver.valid(value)) {
          return {
            value,
            errors: helpers.error('semanticVersion.base')
          }
        }
      }
    }
  })

// You can extend Joi after extend()
// example: Joi.extend(...).extend(...).extend(...)
