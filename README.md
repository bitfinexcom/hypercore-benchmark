# hypercore-benchmark


## noise p2p sharing

one server. client script spawns 100 clients per file. 4 client ever 4 seconds.

```
node p2p-noise-network.js

# wait for 'feed is ready'

then spawn testgroups a 100 clients with `node p2p-noise-swarm.js $testgroup`:

node p2p-noise-swarm.js a
```

## simple write, create different sets of data, up to 10 billion entries

```
node write.js test-50000000 50000000
node write.js test-500000000 500000000
node write.js test-2000000000 2000000000
node write.js test-10000000000 10000000000
```

## running big benchmarks

If you are running benchmarks with multi billion sized hypercores you might want to
increase the memory of the Node.js. Memory is compressed internally but sometimes during
peak performance moments it wants to allocate more

```
# allow node to use 5GB of memory
# useful when sharing huuuuge hypercores
node --max-old-space-size=5000 p2p-noise-swarm.js
```
