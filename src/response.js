'use strict'

class Response {
    constructor(callback) {
        this.cors = true
        this.callback = callback
    }
    setCors(cors) {
        this.cors = !!cors
    }
    json(body, statusCode = 200) {
        return this.build(JSON.stringify(body), statusCode, 'application/json')
    }
    error(error, statusCode) {
        let messages
        if (error instanceof Error) {
            messages = error.toString()
        } else {
            messages = error
        }
        return this.build(JSON.stringify({
            error: messages
        }), statusCode || error.statusCode || 500, 'application/json')
    }
    file(content, contentType, filename) {
        if (typeof content === 'object') {
            content = JSON.stringify(content, null, 4)
        }
        return this.build(content, 200, contentType, {
            'content-disposition': `attachment; filename=${filename}`
        })
    }
    notFound() {
        return this.build({}, 404)
    }
    build(body, statusCode = 200, contentType = 'application/json', headers = {}) {
        headers['Content-Type'] = `${contentType};charset=utf-8`
        if (this.cors) {
            headers['Access-Control-Allow-Origin'] = '*'
            headers['Access-Control-Allow-Headers'] = JSON.stringify([
                'Content-Type',
                'X-Amz-Date',
                'Accept-Encoding',
                'Authorization',
                'X-Api-Key',
                'X-Amz-Security-Token',
                'X-Amz-User-Agent'
            ])
            headers['Access-Control-Allow-Methods'] = JSON.stringify([
                'HEAD',
                'GET',
                'POST',
                'PUT',
                'DELETE'
            ])
        }
        return {
            headers,
            body,
            statusCode
        }
    }
    allowAuthenticate(principalId, resource, context = {}) {
        this.callback(null, this.generatePolicy(principalId, 'Allow', resource, context))
    }
    denyAuthenticate(principalId, resource, context = {}) {
        this.callback(null, this.generatePolicy(principalId, 'Deny', resource, context))
    }
    generatePolicy(principalId, effect, resource, context = {}) {
        let policyDocument = {}
        if (effect && resource) {
            policyDocument.Version = '2012-10-17'
            policyDocument.Statement = [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
        return {
            principalId: principalId,
            policyDocument: policyDocument,
            context: context
        }
    }
}

module.exports = Response
