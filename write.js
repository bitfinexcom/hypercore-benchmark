'use strict'

const hypercore = require('hypercore')
const async = require('async')

const stats = require('./stats')
// january 2017, december 2017, october 2018
const trades = require('./trades-set.json')
const feed = hypercore('./test') // store data in ./directory

feed.ready(() => {
  console.log('feed is ready.')

  const print = stats(feed)
  test(print)
})

function test (print) {
  const started = Date.now()
  const tenBillion = 10000000000
  let count = feed.length

  async.whilst(
    function () { return count < tenBillion },
    function (cb) {
      const batch = []

      while (batch.length < 32768) {
        const ri = Math.floor(Math.random() * trades.length)
        const entry = trades[ri]

        batch.push(JSON.stringify(entry))

        if ((count + batch.length) % 50000000 === 0) {
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
