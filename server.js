// server.js
const express = require('express');
const cors = require('cors');
const gplay = require('./index'); // use local library in the repo

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get('/', (req, res) => res.send('google-play-scraper proxy running'));

// /api/apps/:id -> app details
app.get('/api/apps/:id', async (req, res) => {
  try {
    const opts = {
      appId: req.params.id,
      lang: req.query.lang,
      country: req.query.country,
    };
    const data = await gplay.app(opts);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /api/apps/:id/reviews -> reviews
app.get('/api/apps/:id/reviews', async (req, res) => {
  try {
    const opts = {
      appId: req.params.id,
      lang: req.query.lang,
      country: req.query.country,
      sort: req.query.sort,
      num: req.query.num ? Number(req.query.num) : undefined,
      paginate: req.query.paginate === 'true' ? true : undefined,
      nextPaginationToken: req.query.nextPaginationToken || undefined,
    };
    const data = await gplay.reviews(opts);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  // important: log so Render shows it
  console.log(`Server listening on port ${PORT}`);
});
