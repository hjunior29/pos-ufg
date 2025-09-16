const pool = require('../db/connection');

class Note {
    static async getAll(userId) {
        const result = await pool.query(`
            SELECT 
                n.id, 
                n.title, 
                n.content, 
                n.created_at, 
                n.updated_at,
                COALESCE(
                    json_agg(
                        json_build_object('id', t.id, 'name', t.name, 'color', t.color)
                    ) FILTER (WHERE t.id IS NOT NULL), 
                    '[]'::json
                ) as tags
            FROM notes n
            LEFT JOIN note_tags nt ON n.id = nt.note_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.user_id = $1
            GROUP BY n.id, n.title, n.content, n.created_at, n.updated_at
            ORDER BY n.updated_at DESC
        `, [userId]);
        return result.rows;
    }

    static async getById(id, userId) {
        const result = await pool.query(`
            SELECT 
                n.id, 
                n.title, 
                n.content, 
                n.created_at, 
                n.updated_at,
                COALESCE(
                    json_agg(
                        json_build_object('id', t.id, 'name', t.name, 'color', t.color)
                    ) FILTER (WHERE t.id IS NOT NULL), 
                    '[]'::json
                ) as tags
            FROM notes n
            LEFT JOIN note_tags nt ON n.id = nt.note_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.id = $1 AND n.user_id = $2
            GROUP BY n.id, n.title, n.content, n.created_at, n.updated_at
        `, [id, userId]);
        return result.rows[0];
    }

    static async create(noteData) {
        const { userId, title, content, tagIds = [] } = noteData;
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const noteResult = await client.query(
                'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content, created_at, updated_at',
                [userId, title, content]
            );
            
            const note = noteResult.rows[0];
            
            if (tagIds.length > 0) {
                const tagValues = tagIds.map((tagId, index) => `($1, $${index + 2})`).join(', ');
                const tagParams = [note.id, ...tagIds];
                await client.query(`INSERT INTO note_tags (note_id, tag_id) VALUES ${tagValues}`, tagParams);
            }
            
            await client.query('COMMIT');
            return await this.getById(note.id, userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, userId, noteData) {
        const { title, content, tagIds = [] } = noteData;
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const noteResult = await client.query(
                'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING id',
                [title, content, id, userId]
            );
            
            if (noteResult.rows.length === 0) {
                throw new Error('Note not found');
            }
            
            await client.query('DELETE FROM note_tags WHERE note_id = $1', [id]);
            
            if (tagIds.length > 0) {
                const tagValues = tagIds.map((tagId, index) => `($1, $${index + 2})`).join(', ');
                const tagParams = [id, ...tagIds];
                await client.query(`INSERT INTO note_tags (note_id, tag_id) VALUES ${tagValues}`, tagParams);
            }
            
            await client.query('COMMIT');
            return await this.getById(id, userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );
        return result.rows[0];
    }

    static async search(userId, query) {
        const result = await pool.query(`
            SELECT 
                n.id, 
                n.title, 
                n.content, 
                n.created_at, 
                n.updated_at,
                COALESCE(
                    json_agg(
                        json_build_object('id', t.id, 'name', t.name, 'color', t.color)
                    ) FILTER (WHERE t.id IS NOT NULL), 
                    '[]'::json
                ) as tags
            FROM notes n
            LEFT JOIN note_tags nt ON n.id = nt.note_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.user_id = $1 
            AND (
                to_tsvector('english', n.title) @@ plainto_tsquery('english', $2)
                OR to_tsvector('english', n.content) @@ plainto_tsquery('english', $2)
                OR n.title ILIKE $3
                OR n.content ILIKE $3
            )
            GROUP BY n.id, n.title, n.content, n.created_at, n.updated_at
            ORDER BY n.updated_at DESC
        `, [userId, query, `%${query}%`]);
        return result.rows;
    }

    static async getByTag(userId, tagId) {
        const result = await pool.query(`
            SELECT 
                n.id, 
                n.title, 
                n.content, 
                n.created_at, 
                n.updated_at,
                COALESCE(
                    json_agg(
                        json_build_object('id', t.id, 'name', t.name, 'color', t.color)
                    ) FILTER (WHERE t.id IS NOT NULL), 
                    '[]'::json
                ) as tags
            FROM notes n
            LEFT JOIN note_tags nt ON n.id = nt.note_id
            LEFT JOIN tags t ON nt.tag_id = t.id
            WHERE n.user_id = $1 
            AND n.id IN (
                SELECT note_id FROM note_tags WHERE tag_id = $2
            )
            GROUP BY n.id, n.title, n.content, n.created_at, n.updated_at
            ORDER BY n.updated_at DESC
        `, [userId, tagId]);
        return result.rows;
    }

    static async getAllTags() {
        const result = await pool.query('SELECT id, name, color FROM tags ORDER BY name');
        return result.rows;
    }
}

module.exports = Note;