'use strict'

const os = require('os')

function stats (feed) {
  console.log(`[info] nodejs@${process.version}`)

  let last = Date.now()

  function print () {
    const n = Date.now()
    const diff = n - last

    console.log(n, diff, 'process.memoryUsage()', JSON.stringify(process.memoryUsage()))
    console.log(n, diff, 'process.cpuUsage()', JSON.stringify(process.cpuUsage()))
    console.log(n, diff, 'os.loadavg()', JSON.stringify(os.loadavg()))

    if (feed) {
      console.log(n, diff, 'feed.peers.length', feed.peers.length)
      console.log(n, diff, 'feed.length', feed.length)
    }

    last = Date.now()
  }

  return print
}

module.exports = stats
