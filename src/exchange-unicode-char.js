'use strict'

class ExchangeUnicodeChar {
    unicodeToChar(text) {
        let displayNameUnicode = Array.from(text)
        displayNameUnicode.forEach((str, index) => {
            if ((index % 4) === 0) {
                 displayNameUnicode[index] = '\\u' + str
            }
        })
        displayNameUnicode = displayNameUnicode.join('')

        return displayNameUnicode.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
        })
    }

    toUnicode(theString) {
        let unicodeString = ''
        for (var i = 0; i < theString.length; i++) {
            let theUnicode = theString.charCodeAt(i).toString(16).toUpperCase()
            while (theUnicode.length < 4) {
                theUnicode = '0' + theUnicode
            }
            unicodeString += theUnicode
        }
        return unicodeString
    }
}

module.exports = ExchangeUnicodeChar
