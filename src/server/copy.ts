import path from "path";
import ejs from "ejs";
import fse from "fs-extra";

// @ts-ignore
import { MODE, PUBLIC_URL, GOOGLE_ANALYTICS } from "./inc/constants";
import packagejson from "../../package.json";

const srcDir = "./src/client/dist";
const destDir = "./public";

try {
  fse.rmSync(destDir, { recursive: true, force: true });
  fse.copySync(srcDir, destDir, { overwrite: true });
  console.log(`Successfully copied contents of ${srcDir} to ${destDir}.`);
} catch (err) {
  console.error(err);
}

const indexContent = fse.readFileSync(path.join(__dirname, "/views/index.ejs")).toString("utf-8");

const index = ejs.render(indexContent, {
  VERSION: packagejson.version,
  TITLE: "MTG Diviner",
  DESCRIPTION: "A Magic: The Gathering Card Guessing Game for Streamers",
  GOOGLE_ANALYTICS: GOOGLE_ANALYTICS,
  MODE: MODE,
  PUBLIC_URL: PUBLIC_URL,
});

try {
  fse.writeFile(`${destDir}/index.html`, index);
} catch (err) {
  console.error(err);
}
