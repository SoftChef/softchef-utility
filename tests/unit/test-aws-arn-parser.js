'use strict'

const awsArnParser = require('../../src/aws-arn-parser')

const { expect } = require('chai')

const EXPECTED = {
  IAM_ROLE: {
    partition: 'aws',
    service: 'iam',
    accountId: '123456789012',
    resourceType: 'role',
    resourceId: 'test-role'
  },
  COGNITO_IDP: {
    partition: 'aws',
    service: 'cognito-idp',
    region: 'ap-northeast-1',
    accountId: '123456789012',
    resourceType: 'userpool',
    resourceId: 'ap-northeast-1_XxYyZzAa1'
  },
  IOT_THING: {
    partition: 'aws',
    service: 'iot',
    region: 'ap-northeast-1',
    accountId: '123456789012',
    resourceType: 'thing',
    resourceId: 'thing-name'
  },
  S3_BUCKET: {
    partition: 'aws',
    service: 's3',
    region: '',
    accountId: '',
    resourceType: 'bucket-name'
  },
  API_GATEWAY_RESTAPI: {
    partition: 'aws',
    service: 'apigateway',
    region: 'ap-northeast-1',
    resourceId: '/restapis/xxx'
  },
  EXECUTE_API: {
    partition: 'aws',
    service: 'execute-api',
    region: 'ap-northeast-1',
    accountId: '123456789012',
    resourceId: 'xxxxxx/Prod/xxx/xxx/xxx'
  }
}

describe('Test aws arn parser', () => {
  const verify = ({ partition, service, region, accountId, resourceType, resourceId }, type) => {
    let arn = 'arn:'
    arn += `${partition}:`
    arn += `${service}:`
    arn += region !== undefined ? `${region}:` : ''
    arn += accountId !== undefined ? `${accountId}:` : ''
    if (resourceType) {
      arn += `${resourceType}`
      if (resourceId) {
        arn += `/${resourceId}`
      }
    } else {
      arn += `${resourceId}`
    }
    const awsResource = awsArnParser(arn, type)
    expect(awsResource.partition).to.equal(partition)
    expect(awsResource.service).to.equal(service)
    if (region) {
      expect(awsResource.region).to.equal(region)
    }
    if (accountId) {
      expect(awsResource.accountId).to.equal(accountId)
    }
    expect(awsResource.resourceType).to.equal(resourceType)
    expect(awsResource.resourceId).to.equal(resourceId)
  }

  it('Verifies parser function with iam role arn', () => {
    verify(EXPECTED.IAM_ROLE)
  })

  it('Verifies parser function with cognito-idp arn', () => {
    verify(EXPECTED.COGNITO_IDP)
  })

  it('Verifies parser function with iot thing arn', () => {
    verify(EXPECTED.IOT_THING)
  })

  it('Verifies parser function with s3 bucket arn', () => {
    verify(EXPECTED.S3_BUCKET, 'S3')
  })

  it('Verifies parser function with api gateway restapi arn', () => {
    verify(EXPECTED.API_GATEWAY_RESTAPI)
  })

  it('Verifies parser function with execute-api arn', () => {
    verify(EXPECTED.EXECUTE_API, 'execute-api')
  })

  it('Verifies parser function with invalid arn', () => {
    expect(() => awsArnParser(`arn:xxx`)).to.throw(Error)
  })
})
