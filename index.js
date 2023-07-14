import express from "express";
import fetch from "node-fetch";
import sharp from "sharp";

const app = express();
const PORT = process.env.PORT || 3030;

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://nekos.best/api/v2/neko');
    const data = await response.json();

    if (data.results && data.results.length > 0 && data.results[0].url) {
      const imageUrl = data.results[0].url;
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      const croppedImage = await sharp(imageBuffer)
        .resize(300)
        .extract({ left: 0, top: 0, width: 300, height: 400 })
        .toBuffer();

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': croppedImage.length,
      });
      res.end(croppedImage);
    } else {
      throw new Error('JSON object does not contain "results" or "url" properties');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});