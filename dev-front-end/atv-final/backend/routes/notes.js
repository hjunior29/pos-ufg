const express = require('express');
const Note = require('../models/note');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId || 1;
        const { search, tag } = req.query;
        
        let notes;
        if (search) {
            notes = await Note.search(userId, search);
        } else if (tag) {
            notes = await Note.getByTag(userId, tag);
        } else {
            notes = await Note.getAll(userId);
        }
        
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

router.get('/tags', async (req, res) => {
    try {
        const tags = await Note.getAllTags();
        res.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.query.userId || 1;
        const note = await Note.getById(req.params.id, userId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, content, tagIds } = req.body;
        const userId = req.body.userId || 1;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const note = await Note.create({
            userId,
            title,
            content: content || '',
            tagIds: tagIds || []
        });
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, content, tagIds } = req.body;
        const userId = req.body.userId || 1;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const note = await Note.update(req.params.id, userId, {
            title,
            content: content || '',
            tagIds: tagIds || []
        });
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.query.userId || 1;
        const note = await Note.delete(req.params.id, userId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;