const path = require("path");
const express = require("express");

const { dbpool, MODE, PORT, PUBLIC_URL, GOOGLE_ANALYTICS } = require(path.join(__dirname, "./inc/constants"));

const app = express();

app.engine("html", require("ejs").renderFile);
const pjson = require(path.join(__dirname, "../../package.json"));

/* Add Static Files */
app.use(express.static(path.join(__dirname, "../../public")));

/* Get index */
app.get("/", (req, res) => {
  res.render(path.join(__dirname, "/views/index.ejs"), {
    VERSION: pjson.version,
    TITLE: "MTG Diviner",
    DESCRIPTION: "A Magic: The Gathering Card Guessing Game for Streamers",
    GOOGLE_ANALYTICS: GOOGLE_ANALYTICS,
    MODE: MODE,
    PUBLIC_URL: PUBLIC_URL,
  });
});

/* API: Get cards */
app.get("/cards", (req, res) => {
  let SQLwhere = [];
  let SQLparams = [];

  const query = req.query;

  if (query) {
    let number = 1;
    const minDate = query.minDate;
    if (minDate) {
      SQLwhere.push(`date >= $${number}`);
      SQLparams.push(minDate);
      number++;
    }

    const maxDate = query.maxDate;
    if (maxDate) {
      SQLwhere.push(`date <= $${number}`);
      SQLparams.push(maxDate);
      number++;
    }

    const setType = query.setType;
    if (setType) {
      switch (setType) {
        case "core-expansion":
          SQLwhere.push(`(set_type = $${number} OR set_type = $${number + 1}) AND booster = true`);
          SQLparams.push(`core`);
          SQLparams.push(`expansion`);
          number++;
          number++;
          break;
      }
    }
  }

  const SQLselect = `SELECT * FROM card ${SQLwhere.length ? `WHERE ${SQLwhere.join(" AND ")}` : ``} ORDER BY RANDOM() LIMIT 24;`;

  dbpool
    .query(SQLselect, SQLparams)
    .then((queryresponse) => {
      res.status(200).json(queryresponse.rows);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Database error.",
      });
      console.error(error);
    });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server Startup: Listening on port ${PORT}.`);
});
