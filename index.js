import express from "express";
import fetch from "node-fetch";

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
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
        'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
      });
      res.end(imageBuffer);
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