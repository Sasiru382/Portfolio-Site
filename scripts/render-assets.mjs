import sharp from "sharp";
await sharp("public/og.svg").png().toFile("public/og.png");
await sharp("public/icon.svg")
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("Rendered Open Graph and Apple icons");
