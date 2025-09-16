class API {
    constructor() {
        this.baseURL = '/api';
        this.currentUserId = 1;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Notes endpoints
    async getNotes(filters = {}) {
        const params = new URLSearchParams({
            userId: this.currentUserId,
            ...filters
        });
        return this.request(`/notes?${params}`);
    }

    async getNote(id) {
        return this.request(`/notes/${id}?userId=${this.currentUserId}`);
    }

    async createNote(noteData) {
        return this.request('/notes', {
            method: 'POST',
            body: JSON.stringify({
                ...noteData,
                userId: this.currentUserId
            })
        });
    }

    async updateNote(id, noteData) {
        return this.request(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...noteData,
                userId: this.currentUserId
            })
        });
    }

    async deleteNote(id) {
        return this.request(`/notes/${id}?userId=${this.currentUserId}`, {
            method: 'DELETE'
        });
    }

    async searchNotes(query) {
        return this.request(`/notes?userId=${this.currentUserId}&search=${encodeURIComponent(query)}`);
    }

    async getNotesbyTag(tagId) {
        return this.request(`/notes?userId=${this.currentUserId}&tag=${tagId}`);
    }

    // Tags endpoints
    async getTags() {
        return this.request('/notes/tags');
    }

    // Users endpoints
    async getUsers() {
        return this.request('/users');
    }

    async getUser(id) {
        return this.request(`/users/${id}`);
    }

    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }
}

window.api = new API();