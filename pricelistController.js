// File: backend/controllers/pricelistController.js
const db = require('./database');

exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM products ORDER BY id ASC'
    );

    res.json({
      success: true,
      products: result.rows
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_service, in_price, price, vat, unit, discount } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (product_service !== undefined) {
      updates.push(`product_service = $${paramCount++}`);
      values.push(product_service);
    }
    if (in_price !== undefined) {
      updates.push(`in_price = $${paramCount++}`);
      values.push(parseFloat(in_price) || 0);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(parseFloat(price) || 0);
    }
    if (vat !== undefined) {
      updates.push(`vat = $${paramCount++}`);
      values.push(parseFloat(vat) || 0);
    }
    if (unit !== undefined) {
      updates.push(`unit = $${paramCount++}`);
      values.push(unit);
    }
    if (discount !== undefined) {
      updates.push(`discount = $${paramCount++}`);
      values.push(parseFloat(discount) || 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ 
        error: 'No fields to update' 
      });
    }

    values.push(id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { product_service, in_price, price, vat, unit, discount } = req.body;

    if (!product_service) {
      return res.status(400).json({ 
        error: 'Product/Service name is required' 
      });
    }

    const result = await db.query(
      `INSERT INTO products (product_service, in_price, price, vat, unit, discount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        product_service,
        parseFloat(in_price) || 0,
        parseFloat(price) || 0,
        parseFloat(vat) || 0,
        unit || 'st',
        parseFloat(discount) || 0
      ]
    );

    res.status(201).json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }

};
