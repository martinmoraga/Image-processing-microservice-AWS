import fs from "fs";
import Jimp from "jimp";
import path from "path";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  if (!inputURL || typeof inputURL !== "string") {
    throw new Error("image_url missing or invalid");
  }

  // Descarga la imagen tú
  const resp = await fetch(inputURL, { redirect: "follow" });
  if (!resp.ok) {
    throw new Error(`Upstream HTTP ${resp.status}`);
  }

  const ct = resp.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) {
    throw new Error(`URL did not return an image. Content-Type: ${ct}`);
  }

  const arrayBuf = await resp.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  const photo = await Jimp.read(buf);

  const outpath = path.join(
    "/tmp",
    `filtered.${Date.now()}.${Math.floor(Math.random() * 2000)}.jpg`
  );

  await photo
    .resize(256, 256)
    .quality(60)
    .greyscale()
    .writeAsync(outpath);

  return outpath;
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
