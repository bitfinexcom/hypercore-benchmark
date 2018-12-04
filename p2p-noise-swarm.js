'use strict'

const createClient = require('./p2p-noise-client')

const max = 100
let current = 0
const testGroup = process.argv[2]
console.log('testGroup:', testGroup)

const inter = setInterval(() => {
  if (current === max) {
    clearInterval(inter)
    return
  }

  createClients(5)
}, 4000)

function createClients (n) {
  for (let i = 0; i < n; i++) {
    current = current + 1

    createClient(current, testGroup)

    if (current === max) {
      break
    }
  }
}
