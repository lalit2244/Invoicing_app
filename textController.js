// File: backend/controllers/textController.js
const db = require('./database');

exports.getTexts = async (req, res) => {
  try {
    const { page, language } = req.params;

    // Validate parameters
    if (!page || !language) {
      return res.status(400).json({ 
        error: 'Page and language are required' 
      });
    }

    // Get all texts for the page in specified language
    const result = await db.query(
      'SELECT key, value FROM texts WHERE page = $1 AND language = $2',
      [page, language]
    );

    // Convert to key-value object
    const texts = {};
    result.rows.forEach(row => {
      texts[row.key] = row.value;
    });

    res.json(texts);

  } catch (error) {
    console.error('Get texts error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Get all menu items
exports.getMenuTexts = async (req, res) => {
  try {
    const { language } = req.params;

    const result = await db.query(
      'SELECT key, value FROM texts WHERE page = $1 AND language = $2',
      ['menu', language]
    );

    const menuItems = {};
    result.rows.forEach(row => {
      menuItems[row.key] = row.value;
    });

    res.json(menuItems);

  } catch (error) {
    console.error('Get menu texts error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }

};
