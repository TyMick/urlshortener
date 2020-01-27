"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const util = require("util");
const dns = require("dns");
const lookupPromise = util.promisify(dns.lookup);

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGOLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Create ShortURL model
const Schema = mongoose.Schema;
const shortURLSchema = new Schema({
  url: { type: String, required: true },
  index: { type: Number, required: true }
});
const ShortURL = mongoose.model("ShortURL", shortURLSchema);

// Create Counter model
const counterSchema = new Schema({
  count: { type: Number, required: true, default: 1 }
});
const Counter = mongoose.model("Counter", counterSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Handle new URL submissions
app.post("/api/shorturl/new", async (req, res) => {
  const url = req.body.url;

  // Check protocol
  const protocolMatch = url.match(/^https?:\/\/(.*)/i);
  if (!protocolMatch) {
    return res.json({ error: "invalid URL" });
  }

  // Separate domain/path
  const domainPath = protocolMatch[1];

  // Check domain
  const domainMatch = domainPath.match(/^([\w\-]+\.)+[\w\-]+/i);
  if (!domainMatch) {
    return res.json({ error: "invalid URL" });
  }
  lookupPromise(domainMatch[0])
    //Create new ShortURL, save, return
    .then(async () => {
      const short = new ShortURL({
        url: url,
        index: (await ShortURL.countDocuments({}).exec()) + 1
      });
      try {
        await short.save();
        return res.json({
          original_url: url,
          short_url: short.index
        });
      } catch {
        return res.json({ error: "database save error" });
      }
    })
    .catch(() => {
      return res.json({ error: "invalid domain" });
    });
});

// Redirect short URLs
app.get("/api/shorturl/:index", (req, res) => {
  ShortURL.findOne({ index: parseInt(req.params.index) }, (err, data) => {
    if (err) {
      return res.json({ error: "database error" });
    } else if (data) {
      return res.redirect(data.url);
    } else {
      return res.json({ error: "no such short URL" });
    }
  });
});

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
