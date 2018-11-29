'use strict'

const hypercore = require('hypercore')
const async = require('async')

const stats = require('./stats')
// january 2017, december 2017, october 2018
const trades = require('./trades-set.json')

const argv = process.argv.slice(2)
createBenchmark(argv[0], argv[1])

function createBenchmark (dir, entries) {
  const feed = hypercore(dir) // store data in ./directory
  feed.ready(() => {
    console.log('feed is ready.')
    test(feed, entries)
  })
}

function test (feed, entries) {
  const print = stats(feed)

  const started = Date.now()
  let count = feed.length

  async.whilst(
    function () { return count < entries },
    function (cb) {
      const batch = []

      while (batch.length < 32768) {
        const ri = Math.floor(Math.random() * trades.length)
        const entry = trades[ri]
        entry[1] = Date.now()

        batch.push(JSON.stringify(entry))

        if ((count + batch.length) % (entries / 200) === 0) {
          print()
        }
      }

      feed.append(batch, (err) => {
        if (err) return cb(err)
        count += batch.length
        cb(null, count)
      })
    },
    function (err, n) {
      const ended = Date.now()

      const diff = ended - started
      console.log('[info] started:', started, 'ended', ended)
      console.log('[info] ran fo ', diff, 'ms')

      if (err) {
        print()

        console.log('[info] error at seq', count)
        console.log(err)
        process.exit(1)
      }

      print()
      console.log('[info] finished sucessfully.')
      process.exit(0)
    }
  )
}

module.exports = createBenchmark
