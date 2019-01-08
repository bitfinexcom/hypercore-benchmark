'use strict'

const top = require('process-top')()

function stats (feed) {
  console.log(`[info] nodejs@${process.version}`)

  let last = Date.now()

  function print () {
    const n = Date.now()
    const diff = n - last

    console.log(n, diff, top.toString())

    if (feed) {
      console.log(n, diff, 'feed.peers.length', feed.peers.length)
      console.log(n, diff, 'feed.length', feed.length)
    }

    last = Date.now()
  }

  return print
}

module.exports = stats
