
const fs = require('fs-extra')
const path = require('path')


module.exports = function createDir(dir) { 
    const exists = fs.pathExistsSync(dir)
    if(!exists)
        fs.mkdirSync(dir, { recursive: true }) 
}