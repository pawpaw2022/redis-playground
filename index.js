/** @format */

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Mimic an api call
const postsUrl = "https://jsonplaceholder.typicode.com/posts/";
const commentsUrl = "https://jsonplaceholder.typicode.com/comments/";

// enter: http://localhost:3000/posts?id=1
app.get("/posts", async (req, res) => {
  try {
    const { data } = await axios.get(postsUrl + req.query.id);
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});

const redis = require("redis");
const client = redis.createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

const testing = async () => {
  await client.connect();

  await client.set("key", "value");
  const value = await client.get("key");
  console.log(value);
  await client.disconnect();
};

testing();

// Now with Redis
// Enter: http://localhost:3000/comments?id=1
app.get("/comments", async (req, res) => {
  try {
    const { data } = await axios.get(commentsUrl + req.query.id);
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
