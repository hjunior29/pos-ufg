class Router {
    constructor() {
        this.routes = {
            'notes': this.showNotesView.bind(this),
            'editor': this.showEditorView.bind(this)
        };
        this.currentRoute = 'notes';
        this.routeParams = {};
        
        // Setup URL routing
        this.setupUrlRouting();
    }

    navigate(route, params = {}, updateUrl = true) {
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routeParams = params;
            
            // Update URL if needed
            if (updateUrl) {
                this.updateUrl(route, params);
            }
            
            // Add smooth transition
            const mainContent = document.querySelector('.main-content');
            mainContent.classList.add('page-transitioning');
            
            // Small delay to allow current view to fade out
            setTimeout(() => {
                this.routes[route](params);
                mainContent.classList.remove('page-transitioning');
            }, 50);
        } else {
            console.error(`Route '${route}' not found`);
        }
    }

    showNotesView() {
        document.getElementById('notesView').classList.remove('hidden');
        document.getElementById('editorView').classList.add('hidden');
        document.querySelector('.main-content').classList.remove('editor-mode');
    }

    showEditorView(params = {}) {
        document.getElementById('notesView').classList.add('hidden');
        document.getElementById('editorView').classList.remove('hidden');
        document.querySelector('.main-content').classList.add('editor-mode');
        
        if (params.noteId) {
            window.app.loadNoteForEditing(params.noteId);
        } else {
            window.app.createNewNote();
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getRouteParams() {
        return this.routeParams;
    }

    setupUrlRouting() {
        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => {
            this.handleUrlChange();
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            this.handleUrlChange();
        });
    }

    updateUrl(route, params = {}) {
        let url = `/${route}`;
        
        if (route === 'editor' && params.noteId) {
            url += `/${params.noteId}`;
        }
        
        // Use pushState to update URL without reloading
        history.pushState({ route, params }, '', url);
    }

    handleUrlChange() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        if (pathParts.length === 0 || pathParts[0] === 'notes') {
            // Root or /notes
            this.navigate('notes', {}, false);
        } else if (pathParts[0] === 'editor') {
            // /editor or /editor/:noteId
            const noteId = pathParts[1] || null;
            this.navigate('editor', { noteId }, false);
        } else {
            // Default to notes for unknown routes
            this.navigate('notes', {}, false);
        }
    }

    // Helper method to navigate to a specific note
    navigateToNote(noteId) {
        this.navigate('editor', { noteId });
    }

    // Helper method to navigate to notes list
    navigateToNotes() {
        this.navigate('notes');
    }

    // Helper method to navigate to new note
    navigateToNewNote() {
        this.navigate('editor');
    }
}

window.router = new Router();