'use strict'

const stream = require('stream')
const noise = require('noise-network')
const hypercore = require('hypercore')
const { read } = require('length-prefixed-message')

function createClient (id = '', testGroup = '') {
  const client = noise.connect('a9a5544b217d38cc0165d3fce9381e38464025d26d1e7e38c4ce4a729e73410b')

  // client is a noise-peer stream instance
  process.nextTick(function () { // waiting for bugfix in noise-peer
    read(client, (msg) => {
      msg = msg.toString()
      const p = JSON.parse(msg)

      const feed = hypercore(`./client-dbs/local-${testGroup}-${id}`, p.key)
      stream.pipeline(
        client,
        feed.replicate({ live: true }),
        client,
        (err) => {
          console.log('replication ended', err)
        }
      )
    })
  })
}

module.exports = createClient
