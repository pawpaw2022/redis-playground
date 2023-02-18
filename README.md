# Redis Guide

## Get Started

[Install Redis on macOS](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)

## Integrate with Node

[Redis with Node.js (node_redis) | Redis Documentation Center](https://docs.redis.com/latest/rs/references/client_references/client_nodejs/)

# Redis CLI Commands

## Initialize

- `redis-cli` start the redis-cli
- `quit` to exit

## CRUD

- `SET <KEY> <VALUE>` Create / Update existing Key-Val pair
- `GET <KEY>` Retrieve Key
- `DEL <KEY>` Delete Key

## Others

- `EXISTS <KEY>` return 0 false or 1 true
- `KEY *` return all keys
- `flushall` Flush all (clear) all keys

## Expiration

- `ttl <KEY>` time to live
- `expire <existing-key> <time>`
    - `expire name 10` expire name in 10 s
- `setex <key> <time> <value` set a new pair w expiration

## List (Good for cacheing messages)

- `lpush <LISTNAME> <ITEM>` Push the item to the left of the list
    - `rpush <LISTNAME> <ITEM>` Push the item to the right of the list
- `lrange <LISTNAME> 0 -1` Print out all items
- `lpop <LISTNAME>` Remove the left first
    - `rpop <LISTNAME>` Remove the right first

## Set (Unique Value)

- `sadd <SETNAME> <ITEM>` Add
- `smembers` List all
- `srem <SETNAME> <ITEM>` Remove

## Hash (store k-v pairs inside of a key)

- `hset <HASHNAME> <KEY> <VALUE>` add
- `hget <HASHNAME> <KEY>` retrieve one
- `hgetall <HASHNAME>` retrieve all
- `hdel <HASHNAME> <KEY>` delete one
- `hexists <HASHNAME> <KEY>` check existence

# Redis in NodeJs

Note: Redis @4 won’t work, use @3

`npm i redis@3` 

```jsx
const redis = require("redis");

const redisClient = redis.createClient(); // add {url: } if redis is on the cloud
const EXP_TIME = 60;

const getOrSetCache = (key, callback) => {
  return new Promise((resolve, reject)=>{
    redisClient.get(key, async (err, result) => {
      if (err) return reject(err);
      if (result) {
        console.log("Cache Hit!");
        return resolve(JSON.parse(result));
      } else {
        console.log("Cache Miss");
        const freshData = await callback();
        redisClient.setex(key, EXP_TIME, JSON.stringify(freshData));
        return resolve(freshData);
      } 
    })
  })
}
```

### To use Redis in your api calls:

```jsx
// enter: http://localhost:3000/posts
app.get("/posts", async (req, res) => {
  try {
    const data = await getOrSetCache("posts", async()=>{
      const {data} = await axios.get(postsUrl);
      return data
    })
    res.send(data)
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});
```