'use strict'

const { expect } = require('chai')
const { ExchangeUnicodeChar } = require('../../src')

const expectchar = '測試'
const expectUnicode = '6E2C8A66'

describe('Test exchange coding', () => {
    it('Exchange char to unicode success', (done) => {
        const exchangeCoding = new ExchangeUnicodeChar()
        let result = exchangeCoding.toUnicode(expectchar)
        expect(result).to.equal(expectUnicode)
        done()
    })

    it('Exchange unicode to char success', (done) => {
        const exchangeCoding = new ExchangeUnicodeChar()
        let result = exchangeCoding.unicodeToChar(expectUnicode)
        expect(result).to.equal(expectchar)
        done()
    })
})
