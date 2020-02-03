'use strict'

require('../../src/fs')

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')

describe('Test fs extendsion', () => {
    it('Verifies list files function', (done) => {
        const files = fs.listFiles(
            path.resolve(__dirname)
        )
        for (let file of files) {
            expect(file).to.include.key('key', 'content', 'contentType')
        }
        done()
    })
})
