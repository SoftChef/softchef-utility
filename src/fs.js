'use strict'

const fs = require('fs')
const path = require('path')

fs.listFiles = (targetPath) => {
  let allowExtensions = {
    css: 'text/css',
    js: 'text/javascript',
    html: 'text/html',
    png: 'image/png',
    jpg: 'image/jpg',
    svg: 'image/svg+xml',
    eot: 'application/vnd.ms-fontobject',
    ttf: 'application/font-sfnt',
    woff: 'application/font-woff'
  }
  let result = []
  try {
    let files = fs.readdirSync(targetPath)
    for (const fileName of files) {
      const filePath = `${targetPath}/${fileName}`
      if (fs.lstatSync(filePath).isDirectory()) {
        result.push(
          ...fs.listFiles(filePath)
        )
      }
      let extname = path.extname(fileName).replace('.', '')
      let contentType = allowExtensions[extname] || null
      if (contentType) {
        result.push({
          key: `${targetPath}/${fileName}`,
          content: fs.readFileSync(filePath),
          contentType
        })
      }
    }
  } catch (error) {
    console.error(error)
  }
  return result
}

module.exports = fs
