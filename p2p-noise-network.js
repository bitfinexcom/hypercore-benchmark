'use strict'

const noise = require('noise-network')
const server = noise.createServer()
const stream = require('stream')
const hypercore = require('hypercore')
const { write } = require('length-prefixed-message')
const stats = require('./stats')
const trades = require('./trades-set.json')

const feed = hypercore(`./test`)
feed.ready(() => {
  console.log('feed is ready.')

  const printStats = stats(feed)
  setInterval(() => {
    printStats()
  }, 4000)

  // provide new entries to replicate
  console.log('writing new entries every few seconds...')
  writeSampleBatch()
})

function writeSampleBatch () {
  function _writeSampleBatch (cb) {
    const batch = []
    while (batch.length < 32768) {
      const ri = Math.floor(Math.random() * trades.length)
      const entry = trades[ri]
      entry[1] = Date.now()

      batch.push(JSON.stringify(entry))
    }

    feed.append(batch, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  }
  _writeSampleBatch((err) => {
    if (err) throw err

    setTimeout(() => { writeSampleBatch() }, 4000)
  })
}

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
