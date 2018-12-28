'use strict'

const os = require('os')

function stats (feed) {
  console.log(`[info] nodejs@${process.version}`)
  let startTime = process.hrtime.bigint()
  let startUsage = process.cpuUsage()

  let last = Date.now()

  function print () {
    const n = Date.now()
    const diff = n - last

    console.log(n, diff, 'os.loadavg()', os.loadavg())
    console.log(n, diff, `Total Memory: ${toMb(os.totalmem())}MB | Free Memory: ${toMb(os.freemem())} MB`)

    const mem = process.memoryUsage()
    const memHuman = Object.keys(mem).map((k) => {
      return `${k}: ${toMb(mem[k])}MB |`
    }).join(' ')

    console.log(n, diff, 'process.memoryUsage()', memHuman)

    const elapTimeMS = nanoToMilli(process.hrtime.bigint() - startTime)
    const elapUsage = process.cpuUsage(startUsage)
    const elapUserMS = microToMilli(elapUsage.user)
    const elapSystMS = microToMilli(elapUsage.system)
    const cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS)
    console.log(n, diff, `process.cpuUsage() - cpu percent: ${cpuPercent}%`)

    if (feed) {
      console.log(n, diff, 'feed.peers.length', feed.peers.length)
      console.log(n, diff, 'feed.length', feed.length)
    }

    last = Date.now()

    startTime = process.hrtime.bigint()
    startUsage = process.cpuUsage()
  }

  return print
}

function toMb (bytes) {
  return Math.trunc(bytes / 1e+6)
}

function nanoToMilli (nano) {
  const milli = nano / BigInt(1e+6)
  return Number(milli)
}

function microToMilli (mi) {
  return mi / 1000
}

module.exports = stats
