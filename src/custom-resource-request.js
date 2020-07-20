'use strict'

class CustomResourceRequest {
  constructor(event) {
    const eventProperties = [
      'RequestType',
      'ResourceProperties'
    ]
    eventProperties.forEach(property => {
      if (!event[property]) {
        throw new Error(`event hasn't [${property}] property`)
      }
    })
    this.event = event
  }
  on(types) {
    if (typeof types === 'string') {
      types = [types]
    }
    return types.map(type => {
      return type.toLowerCase()
    }).indexOf(
      this.event.RequestType.toLowerCase()
    ) > -1
  }
  requestType() {
    return this.event.RequestType
  }
  properties() {
    return this.event.ResourceProperties || {}
  }
  property(key) {
    return this.properties()[key] || null
  }
}

module.exports = CustomResourceRequest
