-- Create database schema for Personal Content Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#007AFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS note_tags (
    note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_notes_content ON notes USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Insert default user for demo purposes
INSERT INTO users (name, email) VALUES 
('Demo User', 'demo@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, color) VALUES 
('Pessoal', '#FF6B6B'),
('Trabalho', '#4ECDC4'),
('Ideias', '#45B7D1'),
('Importante', '#FFA07A'),
('Tarefa', '#98D8C8'),
('Reunião', '#F7DC6F'),
('Projeto', '#BB8FCE')
ON CONFLICT (name) DO NOTHING;

-- Update any existing English tags to Portuguese
UPDATE tags SET name = 'Pessoal' WHERE name = 'Personal';
UPDATE tags SET name = 'Trabalho' WHERE name = 'Work';
UPDATE tags SET name = 'Ideias' WHERE name = 'Ideas';
UPDATE tags SET name = 'Importante' WHERE name = 'Important';
UPDATE tags SET name = 'Tarefa' WHERE name = 'Todo';
UPDATE tags SET name = 'Reunião' WHERE name = 'Meeting';
UPDATE tags SET name = 'Projeto' WHERE name = 'Project';

-- Insert sample notes
INSERT INTO notes (user_id, title, content) VALUES 
(1, 'Bem-vindo ao SGCP', 'Este é seu sistema de gerenciamento de conteúdo pessoal. Você pode criar, editar e organizar suas notas aqui.'),
(1, 'Primeiros Passos', 'Comece criando novas notas, adicionando etiquetas e organizando seu conteúdo. Use a função de busca para encontrar rapidamente o que precisa.'),
(1, 'Ideias de Projetos', 'Mantenha registro de suas ideias de projetos e pensamentos aqui. Você pode organizá-las com etiquetas e pesquisar facilmente.')
ON CONFLICT DO NOTHING;

-- Add sample note-tag relationships
INSERT INTO note_tags (note_id, tag_id) VALUES 
(1, 1), -- Nota de boas-vindas com etiqueta Pessoal
(2, 4), -- Primeiros Passos com etiqueta Importante
(3, 3), -- Ideias de Projetos com etiqueta Ideias
(3, 7)  -- Ideias de Projetos com etiqueta Projeto
ON CONFLICT DO NOTHING;