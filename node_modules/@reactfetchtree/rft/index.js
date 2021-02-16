const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "./public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8080, () =>
  console.log(`${path.join(__dirname, "./public/index.html")}`)
);
