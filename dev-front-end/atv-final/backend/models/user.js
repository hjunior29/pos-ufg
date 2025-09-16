const pool = require('../db/connection');

class User {
    static async getAll() {
        const result = await pool.query(
            'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query(
            'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async create(userData) {
        const { name, email } = userData;
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at, updated_at',
            [name, email]
        );
        return result.rows[0];
    }

    static async update(id, userData) {
        const { name, email } = userData;
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, created_at, updated_at',
            [name, email, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = User;