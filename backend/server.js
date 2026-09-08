import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'thokio.db'));
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS pools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL UNIQUE,
    unit_price REAL NOT NULL,
    retail_price REAL NOT NULL,
    target_units INTEGER NOT NULL,
    current_units INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pool_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pool_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    units_purchased INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pool_id) REFERENCES pools(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS generated_kits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    tiktok_script TEXT NOT NULL,
    seo_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial pool
const checkPool = db.prepare('SELECT COUNT(*) as count FROM pools').get();
if (checkPool.count === 0) {
  db.prepare(`
    INSERT INTO pools (product_name, unit_price, retail_price, target_units, current_units)
    VALUES (?, ?, ?, ?, ?)
  `).run('Wireless ANC Earbuds', 12, 45, 100, 82);
  console.log('✅ Database seeded with initial pool');
}

// API ROUTES

/**
 * GET /api/pool
 */
app.get('/api/pool', (req, res) => {
  try {
    const pool = db.prepare(`
      SELECT id, product_name, unit_price, retail_price, target_units, current_units
      FROM pools
      LIMIT 1
    `).get();

    if (!pool) {
      return res.status(404).json({ error: 'No active pool found' });
    }

    const progress_percentage = Math.round((pool.current_units / pool.target_units) * 100);

    res.json({
      id: pool.id,
      product_name: pool.product_name,
      unit_price: pool.unit_price,
      retail_price: pool.retail_price,
      target_units: pool.target_units,
      current_units: pool.current_units,
      progress_percentage,
      savings_per_unit: (pool.retail_price - pool.unit_price).toFixed(2),
      total_savings_percentage: Math.round(((pool.retail_price - pool.unit_price) / pool.retail_price) * 100),
    });
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ error: 'Failed to fetch pool data' });
  }
});

/**
 * POST /api/join-pool
 */
app.post('/api/join-pool', (req, res) => {
  try {
    const { unitsPurchased, userEmail } = req.body;

    if (!userEmail || !unitsPurchased || unitsPurchased <= 0) {
      return res.status(400).json({ error: 'Invalid email or quantity' });
    }

    const pool = db.prepare('SELECT * FROM pools LIMIT 1').get();
    if (!pool) {
      return res.status(404).json({ error: 'No active pool found' });
    }

    const existingMember = db.prepare(`
      SELECT id FROM pool_members WHERE pool_id = ? AND user_email = ?
    `).get(pool.id, userEmail);

    if (existingMember) {
      return res.status(400).json({ error: 'User already joined this pool' });
    }

    const total_amount = unitsPurchased * pool.unit_price;

    db.prepare(`
      INSERT INTO pool_members (pool_id, user_email, units_purchased, total_amount)
      VALUES (?, ?, ?, ?)
    `).run(pool.id, userEmail, unitsPurchased, total_amount);

    db.prepare(`
      UPDATE pools SET current_units = current_units + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(unitsPurchased, pool.id);

    const updatedPool = db.prepare('SELECT * FROM pools WHERE id = ?').get(pool.id);
    const progress_percentage = Math.round((updatedPool.current_units / updatedPool.target_units) * 100);

    res.json({
      success: true,
      message: 'Successfully joined pool',
      pool: {
        current_units: updatedPool.current_units,
        target_units: updatedPool.target_units,
        progress_percentage,
      },
      user: {
        email: userEmail,
        units_purchased: unitsPurchased,
        total_amount: total_amount.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error joining pool:', error);
    res.status(500).json({ error: 'Failed to join pool' });
  }
});

/**
 * POST /api/generate-kit
 */
app.post('/api/generate-kit', async (req, res) => {
  try {
    const { productName, targetAudience } = req.body;

    if (!productName || !targetAudience) {
      return res.status(400).json({ error: 'Missing productName or targetAudience' });
    }

    const existingKit = db.prepare(`
      SELECT * FROM generated_kits WHERE product_name = ? AND target_audience = ?
    `).get(productName, targetAudience);

    if (existingKit) {
      return res.json({
        success: true,
        cached: true,
        kit: {
          tiktok_script: existingKit.tiktok_script,
          seo_description: existingKit.seo_description,
        },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const tiktokPrompt = `Create a short, viral TikTok script hook (under 60 seconds) for the product: "${productName}" targeting "${targetAudience}". Make it engaging, punchy, and conversion-focused. Include hashtags.`;
    const tiktokResponse = await model.generateContent(tiktokPrompt);
    const tiktok_script = tiktokResponse.response.text();

    const seoPrompt = `Create an SEO-optimized product description for Amazon/Shopify for: "${productName}" targeting "${targetAudience}". Include keywords, benefits, and a call-to-action. Keep it under 500 words.`;
    const seoResponse = await model.generateContent(seoPrompt);
    const seo_description = seoResponse.response.text();

    db.prepare(`
      INSERT INTO generated_kits (product_name, target_audience, tiktok_script, seo_description)
      VALUES (?, ?, ?, ?)
    `).run(productName, targetAudience, tiktok_script, seo_description);

    res.json({
      success: true,
      cached: false,
      kit: {
        tiktok_script,
        seo_description,
      },
    });
  } catch (error) {
    console.error('Error generating kit:', error);
    res.status(500).json({ error: 'Failed to generate marketing kit' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'thokio-backend' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Thokio Backend running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${path.join(__dirname, 'thokio.db')}`);
});
