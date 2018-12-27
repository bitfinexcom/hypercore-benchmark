'use strict'

const stream = require('stream')
const noise = require('noise-network')
const hypercore = require('hypercore')
const { read } = require('length-prefixed-message')

function createClient (id = '', testGroup = '', cb) {
  const dir = `./client-dbs/local-${testGroup}-${id}`

  const feed = hypercore(dir, {
    createIfMissing: false
  })

  feed.on('error', () => ready(null))
  feed.on('ready', () => ready(feed))

  function ready (feed) {
    const client = noise.connect('a9a5544b217d38cc0165d3fce9381e38464025d26d1e7e38c4ce4a729e73410b')

    read(client, (msg) => {
      msg = msg.toString()
      const p = JSON.parse(msg)
      if (!feed) feed = hypercore(dir, p.key)

      stream.pipeline(
        client,
        feed.replicate({ live: true }),
        client,
        (err) => {
          console.log('replication ended', err)
        }
      )
    })

    if (cb) cb()
  }
}

module.exports = createClient
