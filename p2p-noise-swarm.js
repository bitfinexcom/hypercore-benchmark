'use strict'

const createClient = require('./p2p-noise-client')

const max = 100
let current = 0

const testGroup = process.argv[2]
console.log('testGroup:', testGroup)

setTimeout(loop, 5000)
const print = require('./stats')()

setInterval(print, 5000)

function loop () {
  if (current >= max) return

  createClients(5, function () {
    setTimeout(loop, 5000)
  })
}

function createClients (n, cb) {
  current = current + 1
  createClient(current, testGroup, function () {
    if (!n || current === max) return cb()
    createClients(n - 1, cb)
  })
}
