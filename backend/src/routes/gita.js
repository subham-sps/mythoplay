const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const db = require('../config/database');

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const SHLOKA_COUNT = 20; // number of seeded shlokas

// Cycles through week 1-SHLOKA_COUNT based on a 2024-01-01 epoch
function getCurrentCycleWeek() {
  const EPOCH = new Date('2024-01-01T00:00:00Z');
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceEpoch = Math.floor((Date.now() - EPOCH.getTime()) / weekMs);
  return (weeksSinceEpoch % SHLOKA_COUNT) + 1;
}

// Maps any week number (1-52) to a seeded week (1-SHLOKA_COUNT)
function toSeedWeek(n) {
  return ((n - 1) % SHLOKA_COUNT) + 1;
}

// GET /api/gita/weekly         → current week's shloka
// GET /api/gita/weekly?week=N  → specific week (1-52 range for navigation)
router.get('/weekly', async (req, res) => {
  try {
    const currentWeek = getCurrentCycleWeek();
    const requestedWeek = req.query.week ? Math.max(1, Math.min(52, parseInt(req.query.week))) : currentWeek;
    const seedWeek = toSeedWeek(requestedWeek);

    const result = await db.query(
      'SELECT id, week_number, reference, chapter, verse, sanskrit, transliteration_english, meaning FROM gita_weekly_shlokas WHERE week_number = $1',
      [seedWeek]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shloka not found for this week' });
    }

    res.json({
      weekNumber: requestedWeek,
      currentWeek,
      shloka: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetching gita shloka:', err);
    res.status(500).json({ error: 'Failed to fetch shloka' });
  }
});

// POST /api/gita/insight
// Body: { shlokaId: number, ageGroup: '5-7'|'8-10'|'11-14' }
router.post('/insight', async (req, res) => {
  try {
    const { shlokaId, ageGroup } = req.body;

    if (!shlokaId || !ageGroup) {
      return res.status(400).json({ error: 'shlokaId and ageGroup are required' });
    }

    const validAgeGroups = ['5-7', '8-10', '11-14'];
    if (!validAgeGroups.includes(ageGroup)) {
      return res.status(400).json({ error: 'Invalid age group' });
    }

    const row = await db.query(
      'SELECT * FROM gita_weekly_shlokas WHERE id = $1',
      [shlokaId]
    );

    if (row.rows.length === 0) {
      return res.status(404).json({ error: 'Shloka not found' });
    }

    const shloka = row.rows[0];
    const cached = (shloka.insights || {})[ageGroup];
    if (cached) {
      return res.json({ insight: cached, cached: true });
    }

    const ageDesc =
      ageGroup === '5-7'
        ? 'a young child aged 5-7 (use very simple words, fun analogies, and very short sentences — 2-3 sentences max)'
        : ageGroup === '8-10'
        ? 'a child aged 8-10 (clear language, relatable school/home examples — 3-4 sentences)'
        : 'a teenager aged 11-14 (deeper insight, real-life lessons, respect their intelligence — 4-5 sentences)';

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI insights not configured on this server' });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a warm, wise teacher explaining Bhagavad Gita wisdom to children in India. Keep explanations concise, inspiring, and age-appropriate. Speak directly to the child.',
        },
        {
          role: 'user',
          content: `Explain this Bhagavad Gita verse for ${ageDesc}:\n\nReference: ${shloka.reference}\nSanskrit: ${shloka.sanskrit}\nMeaning: ${shloka.meaning}\n\nGive a simple, inspiring explanation the child can apply in their daily life.`,
        },
      ],
      max_tokens: 250,
    });

    const insight = completion.choices[0].message.content.trim();

    // Cache in DB
    const updatedInsights = { ...(shloka.insights || {}), [ageGroup]: insight };
    await db.query(
      'UPDATE gita_weekly_shlokas SET insights = $1 WHERE id = $2',
      [JSON.stringify(updatedInsights), shlokaId]
    );

    res.json({ insight, cached: false });
  } catch (err) {
    console.error('Error generating gita insight:', err);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});

module.exports = router;
