'use strict'

const noise = require('noise-network')
const server = noise.createServer()
const stream = require('stream')
const hypercore = require('hypercore')
const { write } = require('length-prefixed-message')
const stats = require('./stats')
const trades = require('./trades-set.json')

const feed = hypercore(process.argv[2] || `./test`)
feed.ready(() => {
  console.log('feed is ready.')

  const printStats = stats(feed)
  setInterval(() => {
    printStats()
  }, 4000)

  // provide new entries to replicate
  writeSampleBatch(true)
})

function writeSampleBatch (printInfo) {
  const interval = 4000
  const elementsPerSecond = 8000
  const batchSize = (interval / 1000) * elementsPerSecond

  if (printInfo) {
    console.log(`writing ${elementsPerSecond} entries every second... (${batchSize} every ${interval}ms)`)
  }

  function _writeSampleBatch (cb) {
    const batch = []
    while (batch.length < batchSize) {
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

    setTimeout(() => { writeSampleBatch(false) }, 4000)
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
