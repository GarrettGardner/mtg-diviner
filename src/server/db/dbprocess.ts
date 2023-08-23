import fse from "fs-extra";
import path from "path";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
const { dbpool } = require(path.join(__dirname, "../inc/constants"));

interface Card {
  id: string;
  color: string;
  cost: string;
  date: string;
  image_art: string;
  image_full: string;
  in_booster: boolean;
  is_legend: boolean;
  is_planeswalker: boolean;
  name: string;
  rarity: string;
  set: string;
  set_type: string;
  type: string;
}

enum LOG_TYPE {
  ERROR = "ERROR",
  SKIP = "SKIP",
  SUCCESS = "SUCCESS",
  COMPLETE = "COMPLETE",
}

const PATH_OUTPUT_TXT = path.join(__dirname, "./files/output.txt");
const PATH_SCRYFALL_JSON = path.join(__dirname, "./files/scryfall.json");
const PATH_SCHEMA_SQL = path.join(__dirname, "./sql/schema.sql");

const VALID_SET_TYPE = ["alchemy", "core", "commander", "draft_innovation", "expansion", "funny", "masters", "masterpiece", "promo", "starter", "token"];
const SKIP_FRAME_EFFECTS = ["inverted", "showcase", "extendedart", "etched"];

const logAction = (type: LOG_TYPE, text?: string, additional?: string) => {
  const line = `${type}: ${text}${additional ? ` (${additional})` : ""}\r\n`;
  fse.appendFile(PATH_OUTPUT_TXT, line).catch((e: Error) => {
    console.error(e.stack);
  });
  if (type === LOG_TYPE.ERROR) {
    console.error(line);
  }
};

const parseCard = (cardScryfall: any): Card | undefined => {
  const id = cardScryfall?.id;
  if (!id) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: ID.`, JSON.stringify(cardScryfall));
    return;
  }

  const name = cardScryfall?.card_faces?.[0]?.name || cardScryfall?.name;
  if (!name) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Name.`, JSON.stringify(cardScryfall));
    return;
  }

  let color = "C";
  if (cardScryfall?.colors?.length) {
    if (cardScryfall.colors.length > 1) {
      color = "M";
    } else {
      color = cardScryfall?.colors?.[0];
    }
  }
  if (cardScryfall?.card_faces?.[0]?.colors?.length) {
    if (cardScryfall.card_faces[0].colors.length > 1) {
      color = "M";
    } else {
      color = cardScryfall.card_faces[0].colors[0];
    }
  }
  if (!color) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Color.`, JSON.stringify(cardScryfall));
    return;
  }

  if (cardScryfall?.content_warning) {
    logAction(LOG_TYPE.SKIP, `Card has a content warning.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  const cost = cardScryfall?.card_faces?.[0]?.mana_cost || cardScryfall?.mana_cost || "";

  const image_art = cardScryfall?.card_faces?.[0]?.image_uris?.art_crop || cardScryfall?.image_uris?.art_crop;
  if (!image_art) {
    logAction(LOG_TYPE.SKIP, `Card has no available Image Art.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  const image_full = cardScryfall?.card_faces?.[0]?.image_uris?.large || cardScryfall?.image_uris?.large;
  if (!image_full) {
    logAction(LOG_TYPE.SKIP, `Card has no available Image Full art.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  const rarity = cardScryfall?.rarity;
  if (!rarity) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Rarity.`, JSON.stringify(cardScryfall));
    return;
  }

  const set = cardScryfall?.set;
  if (!set) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Set.`, JSON.stringify(cardScryfall));
    return;
  }

  let set_type = cardScryfall?.set_type;
  if (!set_type) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Set Type.`, JSON.stringify(cardScryfall));
    return;
  }
  if (set === "mat") {
    // if the set is mat then override the set type
    set_type = "masterpiece";
  }

  let type = cardScryfall?.card_faces?.[0]?.type_line || cardScryfall?.type_line;
  type = type.replaceAll(name, "[Card Name]");
  const legendBeforeCommaIndex = name.indexOf(",");
  if (legendBeforeCommaIndex > 2) {
    const legendName = name.substring(0, legendBeforeCommaIndex);
    type = type.replaceAll(legendName, "[Card Name]");
  }
  if (!type) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Type Line.`, JSON.stringify(cardScryfall));
    return;
  }

  const date = cardScryfall?.released_at;
  if (!date || date.length !== 10) {
    logAction(LOG_TYPE.ERROR, `Malformed card structure: Released At.`, JSON.stringify(cardScryfall));
    return;
  }
  if (Date.parse(date) >= Date.now()) {
    logAction(LOG_TYPE.SKIP, `Card is not released yet.`, JSON.stringify([cardScryfall.id, cardScryfall.name, date]));
    return;
  }

  if (type?.indexOf("Land") !== -1) {
    logAction(LOG_TYPE.SKIP, `Card is a land.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  if (cardScryfall?.lang !== "en") {
    logAction(LOG_TYPE.SKIP, `Card is not english.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  const in_booster = Boolean(cardScryfall?.booster);
  const is_legend = Boolean(type?.indexOf("Legendary") !== -1);
  const is_planeswalker = Boolean(type?.indexOf("Planeswalker") !== -1);

  if (cardScryfall?.full_art !== undefined && cardScryfall.full_art) {
    logAction(LOG_TYPE.SKIP, `Card is full_art.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  if (cardScryfall?.textless !== undefined && cardScryfall.textless) {
    logAction(LOG_TYPE.SKIP, `Card is textless.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  if (cardScryfall?.oversized !== undefined && cardScryfall.oversized) {
    logAction(LOG_TYPE.SKIP, `Card is oversized.`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  if (VALID_SET_TYPE.findIndex((valid_set_type: string) => set_type === valid_set_type) < 0) {
    logAction(LOG_TYPE.SKIP, `Card has skippable set type (${set_type})`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
    return;
  }

  cardScryfall?.frame_effects?.forEach((frame_effect: string) => {
    if (SKIP_FRAME_EFFECTS.findIndex((skip_frame_effect) => frame_effect === skip_frame_effect) >= 0) {
      logAction(LOG_TYPE.SKIP, `Card has skippable frame effect (${frame_effect})`, JSON.stringify([cardScryfall.id, cardScryfall.name]));
      return;
    }
  });

  return {
    id,
    in_booster,
    color,
    cost,
    date,
    image_art,
    image_full,
    is_legend,
    is_planeswalker,
    name,
    rarity,
    set,
    set_type,
    type,
  };
};

const processDB = async () => {
  let outputTxtError = false;
  await fse.writeFile(PATH_OUTPUT_TXT, "").catch((e: Error) => {
    logAction(LOG_TYPE.ERROR, `output.txt file overwrite error: ${e.stack}`);
    outputTxtError = true;
  });

  if (outputTxtError) {
    return;
  }

  let updateSQLError = false;
  const updateSQL = await fse.readFileSync(PATH_SCHEMA_SQL).toString();
  await dbpool.query(updateSQL).catch((e: Error) => {
    logAction(LOG_TYPE.ERROR, `DB Update error: ${e.stack}`);
    updateSQLError = true;
  });

  if (updateSQLError) {
    return;
  }

  let numberSkipped = 0;
  let numberInserted = 0;
  let numberError = 0;
  const query = `
    INSERT INTO card (
      id,
      color,
      cost,
      date,
      image_art,
      image_full,
      in_booster,
      is_legend,
      is_planeswalker,
      name,
      rarity,
      set,
      set_type,
      type
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    ) RETURNING id;`;

  let stream = fse.createReadStream(PATH_SCRYFALL_JSON);
  stream
    .pipe(parser())
    .pipe(streamArray())
    .on("data", (d: any) => processCard(d.value))
    .on("end", () => endProcess());

  const processCard = async (cardInput: any) => {
    const card = parseCard(cardInput);
    if (!card) {
      numberSkipped++;
      return;
    }
    const cardArray = [
      card.id,
      card.color,
      card.cost,
      card.date,
      card.image_art,
      card.image_full,
      card.in_booster,
      card.is_legend,
      card.is_planeswalker,
      card.name,
      card.rarity,
      card.set,
      card.set_type,
      card.type,
    ];
    let hasError = false;
    await dbpool.query(query, cardArray).catch((e: Error) => {
      logAction(LOG_TYPE.ERROR, `DB Insert error: ${e.stack}`, JSON.stringify([card.id, card.name]));
      hasError = true;
    });
    if (hasError) {
      numberError++;
      return;
    } else {
      logAction(LOG_TYPE.SUCCESS, `DB Insert success.`, JSON.stringify([card.id, card.name]));
    }
    numberInserted++;
  };

  const endProcess = () => {
    const message = `DB Process completed successfully: ${numberInserted} cards inserted, ${numberSkipped} cards skipped, ${numberError} cards errored.`;
    logAction(LOG_TYPE.COMPLETE, message);
    console.log(message);
  };
};

processDB();
