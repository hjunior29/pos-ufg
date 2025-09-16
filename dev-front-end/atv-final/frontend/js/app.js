class App {
    constructor() {
        this.notes = [];
        this.tags = [];
        this.currentNote = null;
        this.isEditing = false;
        this.currentFilter = null;
        this.searchDebounced = Components.debounce(this.performSearch.bind(this), 300);
        this.autoSaveDebounced = Components.debounce(this.autoSave.bind(this), 1000);
        this.hasUnsavedChanges = false;
        this.originalNoteData = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadTags();
            await this.loadNotes();
            this.setupEventListeners();
            this.renderTags();
            this.renderNotes();
            
            // Initialize view mode
            const savedViewMode = localStorage.getItem('viewMode') || 'grid';
            this.setViewMode(savedViewMode);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            Components.showToast('Falha ao carregar aplicação', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('newNoteBtn').addEventListener('click', () => {
            this.closeMobileMenu();
            window.router.navigate('editor');
        });

        document.getElementById('backToNotesBtn').addEventListener('click', () => {
            this.handleBackToNotes();
        });

        document.getElementById('allNotesBtn').addEventListener('click', () => {
            this.closeMobileMenu();
            this.clearFilters();
        });

        // Logo button - go to home without filters
        document.getElementById('logoButton').addEventListener('click', () => {
            this.closeMobileMenu();
            this.clearFilters();
            window.router.navigate('notes');
        });

        // Search - Desktop
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                this.searchDebounced(query);
            } else {
                this.clearSearch();
            }
        });

        // Search - Mobile
        document.getElementById('mobileSearchInput').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                this.searchDebounced(query);
            } else {
                this.clearSearch();
            }
        });

        // Editor actions
        document.getElementById('saveNoteBtn').addEventListener('click', () => {
            this.saveNote();
        });

        document.getElementById('deleteNoteBtn').addEventListener('click', () => {
            this.deleteCurrentNote();
        });

        // Auto-save on content change
        document.getElementById('noteTitle').addEventListener('input', () => {
            this.markAsChanged();
            this.autoSaveDebounced();
        });

        document.getElementById('noteContent').addEventListener('input', () => {
            this.markAsChanged();
            this.autoSaveDebounced();
        });

        // View toggle buttons
        document.getElementById('gridViewBtn').addEventListener('click', () => {
            this.setViewMode('grid');
        });

        document.getElementById('listViewBtn').addEventListener('click', () => {
            this.setViewMode('list');
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking overlay
        document.getElementById('sidebarOverlay').addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close mobile menu when pressing ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    async loadNotes() {
        try {
            Components.showLoading();
            this.notes = await window.api.getNotes();
            this.renderNotes();
        } catch (error) {
            console.error('Failed to load notes:', error);
            Components.showToast('Falha ao carregar notas', 'error');
        } finally {
            Components.hideLoading();
        }
    }

    async loadTags() {
        try {
            this.tags = await window.api.getTags();
        } catch (error) {
            console.error('Failed to load tags:', error);
            Components.showToast('Falha ao carregar etiquetas', 'error');
        }
    }

    renderNotes() {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        if (this.notes.length === 0) {
            const emptyState = Components.createEmptyState(
                'Nenhuma nota encontrada',
                'Crie sua primeira nota para começar',
                '📝'
            );
            notesContainer.classList.add('empty');
            notesContainer.appendChild(emptyState);
            return;
        }

        notesContainer.classList.remove('empty');
        this.notes.forEach((note, index) => {
            const noteCard = Components.createNoteCard(note);
            // Add staggered animation delay
            noteCard.style.animationDelay = `${index * 0.1}s`;
            notesContainer.appendChild(noteCard);
        });
    }

    renderTags() {
        const tagsList = document.getElementById('tagsList');
        tagsList.innerHTML = '';

        this.tags.forEach(tag => {
            const tagItem = Components.createTagItem(tag);
            tagsList.appendChild(tagItem);
        });
    }

    async performSearch(query) {
        try {
            Components.showLoading();
            this.notes = await window.api.searchNotes(query);
            this.renderNotes();
            this.updateViewTitle(`Resultados da busca por "${query}"`);
            this.currentFilter = { type: 'search', query };
        } catch (error) {
            console.error('Search failed:', error);
            Components.showToast('Busca falhou', 'error');
        } finally {
            Components.hideLoading();
        }
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        document.getElementById('mobileSearchInput').value = '';
        this.loadNotes();
        this.updateViewTitle('Todas as Notas');
    }

    async filterByTag(tagId, tagName) {
        try {
            Components.showLoading();
            this.notes = await window.api.getNotesbyTag(tagId);
            this.renderNotes();
            this.updateViewTitle(`Etiquetadas com "${tagName}"`);
            this.currentFilter = { type: 'tag', tagId, tagName };
            this.updateTagsHighlight(tagId);
        } catch (error) {
            console.error('Filter failed:', error);
            Components.showToast('Filtro falhou', 'error');
        } finally {
            Components.hideLoading();
        }
    }

    clearFilters() {
        this.currentFilter = null;
        this.clearSearch();
        this.updateTagsHighlight(null);
    }

    applyLastFilter() {
        if (this.currentFilter) {
            if (this.currentFilter.type === 'tag') {
                this.filterByTag(this.currentFilter.tagId, this.currentFilter.tagName);
            } else if (this.currentFilter.type === 'search') {
                document.getElementById('searchInput').value = this.currentFilter.query;
                document.getElementById('mobileSearchInput').value = this.currentFilter.query;
                this.performSearch(this.currentFilter.query);
            }
        } else {
            this.loadNotes();
        }
    }

    updateTagsHighlight(activeTagId) {
        const tagItems = document.querySelectorAll('.tag-item');
        tagItems.forEach(item => {
            const tagId = parseInt(item.dataset.tagId);
            item.classList.toggle('active', tagId === activeTagId);
        });
    }

    updateViewTitle(title) {
        document.getElementById('viewTitle').textContent = title;
        // Also update mobile title
        document.getElementById('mobileTitle').textContent = title;
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const body = document.body;
        
        const isOpen = sidebar.classList.contains('sidebar-open');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const body = document.body;
        const mobileHeader = document.querySelector('.mobile-header');
        
        // Disable transition for instant opening
        if (mobileHeader) {
            mobileHeader.style.transition = 'none';
        }
        
        sidebar.classList.add('sidebar-open');
        overlay.classList.add('active');
        body.classList.add('sidebar-open');
        
        // Re-enable transition after a frame for closing
        setTimeout(() => {
            if (mobileHeader) {
                mobileHeader.style.transition = 'opacity 0.3s ease-in-out';
            }
        }, 16);
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const body = document.body;
        const mobileHeader = document.querySelector('.mobile-header');
        
        // Ensure transition is enabled for smooth closing
        if (mobileHeader) {
            mobileHeader.style.transition = 'opacity 0.3s ease-in-out';
        }
        
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-open');
    }

    setViewMode(mode) {
        const notesContainer = document.getElementById('notesContainer');
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (mode === 'list') {
            notesContainer.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        } else {
            notesContainer.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        }

        localStorage.setItem('viewMode', mode);
    }

    async loadNoteForEditing(noteId) {
        try {
            Components.showLoading();
            this.currentNote = await window.api.getNote(noteId);
            this.isEditing = true;
            this.populateEditor();
        } catch (error) {
            console.error('Failed to load note:', error);
            Components.showToast('Falha ao carregar nota', 'error');
            window.router.navigate('notes');
        } finally {
            Components.hideLoading();
        }
    }

    createNewNote() {
        this.currentNote = {
            title: '',
            content: '',
            tags: []
        };
        
        // Auto-select tag if filtering by tag
        if (this.currentFilter && this.currentFilter.type === 'tag') {
            const selectedTag = this.tags.find(tag => tag.id === this.currentFilter.tagId);
            if (selectedTag) {
                this.currentNote.tags = [selectedTag];
            }
        }
        
        this.isEditing = false;
        this.populateEditor();
    }

    populateEditor() {
        document.getElementById('noteTitle').value = this.currentNote.title || '';
        document.getElementById('noteContent').value = this.currentNote.content || '';
        
        const tagsEditor = document.getElementById('tagsEditor');
        const selectedTagIds = this.currentNote.tags ? this.currentNote.tags.map(tag => tag.id) : [];
        const tagEditor = Components.createTagEditor(this.tags, selectedTagIds);
        
        tagsEditor.innerHTML = '';
        tagsEditor.appendChild(tagEditor);

        // Add event listeners to tag checkboxes to detect changes
        const checkboxes = tagEditor.querySelectorAll('.tag-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.markAsChanged();
            });
        });

        const deleteBtn = document.getElementById('deleteNoteBtn');
        deleteBtn.style.display = this.isEditing ? 'inline-flex' : 'none';
        
        // Store original data for comparison
        this.originalNoteData = this.gatherNoteData();
        this.hasUnsavedChanges = false;
    }

    async autoSave() {
        if (!this.isEditing || !this.currentNote.id) return;
        
        try {
            const updatedData = this.gatherNoteData();
            await window.api.updateNote(this.currentNote.id, updatedData);
            console.log('Auto-saved note');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    async saveNote() {
        try {
            Components.showLoading();
            const noteData = this.gatherNoteData();

            if (!noteData.title.trim()) {
                Components.showToast('Por favor, insira um título para a nota', 'warning');
                return;
            }

            let savedNote;
            if (this.isEditing && this.currentNote.id) {
                savedNote = await window.api.updateNote(this.currentNote.id, noteData);
                Components.showToast('Nota atualizada com sucesso');
            } else {
                savedNote = await window.api.createNote(noteData);
                Components.showToast('Nota criada com sucesso');
                this.isEditing = true;
            }

            this.currentNote = savedNote;
            this.hasUnsavedChanges = false;
            
            // Redirect back to notes view with last filter applied immediately
            window.router.navigate('notes');
            this.applyLastFilter();
            
        } catch (error) {
            console.error('Failed to save note:', error);
            Components.showToast('Falha ao salvar nota', 'error');
        } finally {
            Components.hideLoading();
        }
    }

    gatherNoteData() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const tagIds = Components.getSelectedTagIds();

        return { title, content, tagIds };
    }

    async deleteCurrentNote() {
        if (!this.currentNote.id) return;

        const confirmed = await Components.showConfirmation(
            'Excluir Nota',
            'Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.',
            'Excluir',
            'Cancelar'
        );

        if (!confirmed) return;

        try {
            Components.showLoading();
            await window.api.deleteNote(this.currentNote.id);
            Components.showToast('Nota excluída com sucesso');
            window.router.navigate('notes');
            this.loadNotes();
        } catch (error) {
            console.error('Failed to delete note:', error);
            Components.showToast('Falha ao excluir nota', 'error');
        } finally {
            Components.hideLoading();
        }
    }

    markAsChanged() {
        if (this.originalNoteData) {
            const currentData = this.gatherNoteData();
            this.hasUnsavedChanges = this.hasNoteChanged(this.originalNoteData, currentData);
        }
    }

    hasNoteChanged(original, current) {
        return original.title !== current.title ||
               original.content !== current.content ||
               JSON.stringify(original.tagIds.sort()) !== JSON.stringify(current.tagIds.sort());
    }

    hasContentInNote() {
        const noteData = this.gatherNoteData();
        return noteData.title.trim() !== '' || 
               noteData.content.trim() !== '' || 
               noteData.tagIds.length > 0;
    }

    async handleBackToNotes() {
        if (this.hasUnsavedChanges && this.hasContentInNote()) {
            const confirmed = await Components.showConfirmation(
                'Alterações não salvas',
                'Você tem alterações não salvas. Deseja sair sem salvar? As alterações serão perdidas.',
                'Sair sem salvar',
                'Continuar editando'
            );
            if (!confirmed) {
                return;
            }
        }
        window.router.navigate('notes');
        this.applyLastFilter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});