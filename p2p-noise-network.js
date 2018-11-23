'use strict'

const noise = require('noise-network')
const server = noise.createServer()
const stream = require('stream')
const hypercore = require('hypercore')
const { write } = require('length-prefixed-message')
const stats = require('./stats')

const feed = hypercore(`./test`)
feed.ready(() => {
  console.log('feed is ready.')

  const printStats = stats(feed)
  setInterval(() => {
    printStats()
  }, 4000)
})

server.on('connection', function (encryptedStream) {
  // console.log('new encrypted stream!')

  write(encryptedStream, JSON.stringify({
    key: feed.key.toString('hex')
  }))

  stream.pipeline(
    encryptedStream,
    feed.replicate({ live: true }),
    encryptedStream,
    (err) => {
      console.log('replication ended', err)
    }
  )
})

const keyPair = noise.seedKeygen(Buffer.alloc(32, 'secret'))

// Announce ourself to the HyperSwarm DHT on the following keyPair's publicKey
server.listen(keyPair, function () {
  console.log('Server is listening on:', server.publicKey.toString('hex'))
})
