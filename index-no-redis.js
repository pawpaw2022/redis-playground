/** @format */

// No Redis Used
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Mimic an api call
const postsUrl = "https://jsonplaceholder.typicode.com/posts/";

// enter: http://localhost:3000/posts?id=1
app.get("/posts", async (req, res) => {
  try {
    const { data } = await axios.get(postsUrl + req.query.id);
    res.send(data);
  } catch (error) {
    res.status(400).send("Failed to fetch posts");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
