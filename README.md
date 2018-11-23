# hypercore-benchmark


## noise p2p sharing

one server. client script spawns 100 clients per file. 4 client ever 4 seconds.

```
node p2p-noise-network.js

# wait for 'feed is ready'

then spawn testgroups a 100 clients with `node p2p-noise-swarm.js $testgroup`:

node p2p-noise-swarm.js a
```

## simple write, 10 billion entries

```
node write.js
```
