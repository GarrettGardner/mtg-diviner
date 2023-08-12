import fse from "fs-extra";

const srcDir = "./src/client/dist";
const destDir = "./public";

try {
  fse.rmSync(destDir, { recursive: true, force: true });
  fse.copySync(srcDir, destDir, { overwrite: true });
  console.log("Successfully copied.");
} catch (err) {
  console.error(err);
}
