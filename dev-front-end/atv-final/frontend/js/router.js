class Router {
    constructor() {
        this.routes = {
            'notes': this.showNotesView.bind(this),
            'editor': this.showEditorView.bind(this)
        };
        this.currentRoute = 'notes';
        this.routeParams = {};
    }

    navigate(route, params = {}) {
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routeParams = params;
            
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
}

window.router = new Router();