/** @format */
// Now with Redis
const express = require("express");
const axios = require("axios");
const redis = require("redis");


const app = express();
app.use(express.json());

const client = redis.createClient();
client.on('error', err => {
  console.log('Error ' + err);
});

// Mimic an api call
const commentsUrl = "https://jsonplaceholder.typicode.com/comments/";


client.set('foo', 'bar', (err, reply) => {
  if (err) throw err;
  console.log(reply);

  client.get('foo', (err, reply) => {
      if (err) throw err;
      console.log(reply);
  });
});

// Enter: http://localhost:3000/comments
app.get("/comments", async (req, res) => {
  try {
    const { data } = await axios.get(commentsUrl);
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});

// Enter: http://localhost:3000/comments/1
app.get("/comments/:id", async (req, res) => {
  try {
    const { data } = await axios.get(commentsUrl + req.params.id);
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
