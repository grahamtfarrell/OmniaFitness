import { readFile } from "fs/promises";
import { join } from "path";

export async function getOmniaOIconSrc() {
  const imageData = await readFile(join(process.cwd(), "public/omnia-o.png"));
  return `data:image/png;base64,${imageData.toString("base64")}`;
}
