const fs = require('fs')
function init () {
  const access = fs.createWriteStream('allLogs.log')
  process.stdout.write = access.write.bind(access)
  process.stderr.write = process.stdout.write
}
module.exports = {
  init
}
