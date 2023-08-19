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

    const inBooster = query.inBooster;
    if (inBooster === "true") {
      SQLwhere.push(`in_booster = true`);
    } else if (inBooster === "false") {
      SQLwhere.push(`in_booster = false`);
    }

    const isLatestExpansion = query.isLatestExpansion;
    if (isLatestExpansion) {
      SQLwhere.push(`(set = (SELECT set FROM card WHERE set_type = $${number} OR set_type = $${number + 1} ORDER BY date DESC LIMIT 1))`);
      SQLparams.push("expansion");
      SQLparams.push("core");
      number++;
      number++;
    }

    const isLegend = query.isLegend;
    if (isLegend === "true") {
      SQLwhere.push(`(is_legend = true)`);
    } else if (isLegend === "false") {
      SQLwhere.push(`(is_legend = false)`);
    }

    const isPlaneswalker = query.isPlaneswalker;
    if (isPlaneswalker === "true") {
      SQLwhere.push(`(is_planeswalker = true)`);
    } else if (isPlaneswalker === "false") {
      SQLwhere.push(`(is_planeswalker = false)`);
    }

    const maxDate = query.maxDate;
    if (maxDate) {
      SQLwhere.push(`date <= $${number}`);
      SQLparams.push(maxDate);
      number++;
    }

    const minDate = query.minDate;
    if (minDate) {
      SQLwhere.push(`date >= $${number}`);
      SQLparams.push(minDate);
      number++;
    }

    const set = query.set;
    if (set) {
      SQLwhere.push(`(set = $${number})`);
      SQLparams.push(set);
      number++;
    }

    const setType = query.setType;
    if (
      setType &&
      ["alchemy", "core", "commander", "draft_innovation", "expansion", "funny", "masters", "masterpiece", "promo", "starter", "token"].findIndex(
        (valid) => setType === valid,
      ) >= 0
    ) {
      SQLwhere.push(`(set_type = $${number})`);
      SQLparams.push(setType);
      number++;
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
