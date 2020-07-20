'use strict'

module.exports = (arn, type = null) => {
  const commonRegexp = /^arn:(aws):([\w-]*):([\w-]*):([\d]*):([\w-_]*)\/([\w-_]*)$/
  const globalRexexp = /^arn:(aws):([\w-]*):([\d]*):([\w-_]*)\/([\w-_]*)$/
  const nonResourceTypeRegexp = /^arn:(aws):([\w-]*):([\w-]*):([\w-_/]*)$/
  const s3Regexp = /^arn:(aws):(s3):::([\w-]*)\/?(.*)?$/
  const executeApiRegexp = /^arn:(aws):(execute-api):([\w-]*):([\d]*):([\w*]*)\/([\w*]*)\/([\w*]*)\/(.*)/
  if (type === 'S3') {
    const [ input, partition, service, resourceType, resourceId ] = arn.match(s3Regexp)
    return {
      input, partition, service, resourceType, resourceId
    }
  } else if (type === 'execute-api') {
    const [ input, partition, service, region, accountId, restApiId, stage, method, path ] = arn.match(executeApiRegexp)
    const resourceId = `${restApiId}/${stage}/${method}/${path}`
    return {
      input, partition, service, region, accountId, resourceId, restApiId, stage, method, path
    }
  }
  if (commonRegexp.test(arn)) {
    const [ input, partition, service, region, accountId, resourceType, resourceId ] = arn.match(commonRegexp)
    return {
      input, partition, service, region, accountId, resourceType, resourceId
    }
  }
  if (globalRexexp.test(arn)) {
    const [ input, partition, service, accountId, resourceType, resourceId ] = arn.match(globalRexexp)
    return {
      input, partition, service, accountId, resourceType, resourceId
    }
  }
  if (nonResourceTypeRegexp.test(arn)) {
    const [ input, partition, service, region, resourceId ] = arn.match(nonResourceTypeRegexp)
    return {
      input, partition, service, region, resourceId
    }
  } else {
    throw new Error(`The arn is invalid`)
  }
}
