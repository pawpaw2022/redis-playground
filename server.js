/** @format */

const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();
app.use(express.json());

const redisClient = redis.createClient(); // add {url: } if redis is on the cloud
const EXP_TIME = 60;

const postsUrl = "https://jsonplaceholder.typicode.com/posts/";

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

// enter: http://localhost:3000/posts/1
app.get("/posts/:id", async (req, res) => {
  try {
    const data = await getOrSetCache(`posts/${req.params.id}`, async()=>{
      const { data } = await axios.get(postsUrl + req.params.id);
      return data
    })
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});

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


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
