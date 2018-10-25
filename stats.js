'use strict'

const os = require('os')

function stats (feed) {
  console.log(`[info] nodejs@${process.version}`)

  let last = Date.now()

  function print () {
    const n = Date.now()
    const diff = n - last

    const cM = process.memoryUsage()
    const cC = process.cpuUsage()
    const lA = os.loadavg()

    console.log(n, diff, 'process.memoryUsage()', JSON.stringify(lA))
    console.log(n, diff, 'process.cpuUsage()', JSON.stringify(cM))
    console.log(n, diff, 'os.loadavg()', JSON.stringify(cC))
    console.log(n, diff, 'feed.peers.length', feed.peers.length)

    last = Date.now()
  }

  return print
}

module.exports = stats
