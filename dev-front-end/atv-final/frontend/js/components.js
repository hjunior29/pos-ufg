class Components {
    static formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Agora mesmo';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} horas atrás`;
        } else if (diffInHours < 48) {
            return 'Ontem';
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    }

    static truncateText(text, maxLength = 150) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength).trim() + '...';
    }

    static createNoteCard(note) {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.dataset.noteId = note.id;

        const tagsHTML = note.tags && note.tags.length > 0 
            ? note.tags.map(tag => `
                <span class="tag" style="background-color: ${tag.color};">
                    <span class="tag-dot"></span>
                    ${tag.name}
                </span>
            `).join('')
            : '';

        noteCard.innerHTML = `
            <div class="note-meta">
                <span class="note-date">${this.formatDate(note.updated_at)}</span>
            </div>
            <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
            <p class="note-preview">${this.escapeHtml(this.truncateText(note.content))}</p>
            <div class="note-tags">${tagsHTML}</div>
        `;

        noteCard.addEventListener('click', () => {
            window.router.navigate('editor', { noteId: note.id });
        });

        return noteCard;
    }

    static createTagItem(tag, isActive = false) {
        const tagItem = document.createElement('div');
        tagItem.className = `tag-item ${isActive ? 'active' : ''}`;
        tagItem.dataset.tagId = tag.id;

        tagItem.innerHTML = `
            <span class="tag-color" style="background-color: ${tag.color};"></span>
            <span class="tag-name">${this.escapeHtml(tag.name)}</span>
        `;

        tagItem.addEventListener('click', () => {
            window.app.closeMobileMenu();
            window.app.filterByTag(tag.id, tag.name);
        });

        return tagItem;
    }

    static createTagEditor(tags, selectedTagIds = []) {
        const container = document.createElement('div');
        container.className = 'tags-input';

        tags.forEach(tag => {
            const isSelected = selectedTagIds.includes(tag.id);
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `tag-${tag.id}`;
            checkbox.className = 'tag-checkbox';
            checkbox.value = tag.id;
            checkbox.checked = isSelected;

            const label = document.createElement('label');
            label.htmlFor = `tag-${tag.id}`;
            label.className = 'tag-label';
            label.style.color = isSelected ? 'white' : '';
            label.innerHTML = `
                <span class="tag-color" style="background-color: ${tag.color};"></span>
                ${this.escapeHtml(tag.name)}
            `;

            container.appendChild(checkbox);
            container.appendChild(label);
        });

        return container;
    }

    static getSelectedTagIds() {
        const checkboxes = document.querySelectorAll('.tag-checkbox:checked');
        return Array.from(checkboxes).map(cb => parseInt(cb.value));
    }

    static showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    static showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('hidden');
    }

    static hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('hidden');
    }

    static createEmptyState(title, description, iconText = '◯') {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        emptyState.innerHTML = `
            <div class="empty-icon">${iconText}</div>
            <h3 class="empty-title">${this.escapeHtml(title)}</h3>
            <p class="empty-description">${this.escapeHtml(description)}</p>
        `;

        return emptyState;
    }

    static escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static showConfirmation(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirmationModal');
            const titleElement = document.getElementById('confirmationTitle');
            const messageElement = document.getElementById('confirmationMessage');
            const confirmButton = document.getElementById('confirmationConfirm');
            const cancelButton = document.getElementById('confirmationCancel');

            titleElement.textContent = title;
            messageElement.textContent = message;
            confirmButton.textContent = confirmText;
            cancelButton.textContent = cancelText;

            modal.classList.remove('hidden');

            const handleConfirm = () => {
                modal.classList.add('hidden');
                cleanup();
                resolve(true);
            };

            const handleCancel = () => {
                modal.classList.add('hidden');
                cleanup();
                resolve(false);
            };

            const handleOverlayClick = (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            };

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            const cleanup = () => {
                confirmButton.removeEventListener('click', handleConfirm);
                cancelButton.removeEventListener('click', handleCancel);
                modal.removeEventListener('click', handleOverlayClick);
                document.removeEventListener('keydown', handleEscape);
            };

            confirmButton.addEventListener('click', handleConfirm);
            cancelButton.addEventListener('click', handleCancel);
            modal.addEventListener('click', handleOverlayClick);
            document.addEventListener('keydown', handleEscape);
        });
    }
}

window.Components = Components;