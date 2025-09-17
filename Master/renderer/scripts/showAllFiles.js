const { ipcRenderer } = require('electron');

class TrackManager {
    constructor(container) {
        this.container = container;
        this.columns = [];
        this.thirdColumn = null;
        this.trackElements = [];
        this.audioFiles = [];
        this.currentlySelectedTrack = null;
        this.isThreeColumnMode = false;

        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    initialize() {
        if (!window.UIComponents) {
            return;
        }

        this.buildColumns();
        this.loadAudioFiles();
        document.addEventListener('click', this.handleDocumentClick);
        window.addEventListener('resize', this.handleResize);
    }

    buildColumns() {
        this.container.innerHTML = '';
        const firstColumn = window.UIComponents.createTrackColumn();
        const secondColumn = window.UIComponents.createTrackColumn();
        const thirdColumn = window.UIComponents.createTrackColumn({ isThird: true });

        this.columns = [firstColumn, secondColumn, thirdColumn];
        this.thirdColumn = thirdColumn;

        this.columns.forEach(column => {
            this.container.appendChild(column);
        });
    }

    loadAudioFiles() {
        try {
            const storedFiles = localStorage.getItem('selectedAudioFiles');
            if (!storedFiles) {
                this.redirectToInitialScreen();
                return;
            }

            const parsedFiles = JSON.parse(storedFiles);
            if (!Array.isArray(parsedFiles) || parsedFiles.length === 0) {
                this.redirectToInitialScreen();
                return;
            }

            this.audioFiles = parsedFiles;
            this.isThreeColumnMode = window.innerWidth >= 1800;
            this.createTrackComponents();
            this.applyLayout(window.innerWidth);
        } catch (error) {
            console.error('Error loading audio files:', error);
            this.redirectToInitialScreen();
        }
    }

    createTrackComponents() {
        this.trackElements = this.audioFiles.map((file, index) => {
            const displayName = typeof file.name === 'string'
                ? file.name.replace(/\.[^/.]+$/, '')
                : `Track ${index + 1}`;

            return window.UIComponents.createTrackComponent({
                name: displayName,
                filePath: file.path,
                index
            });
        });

        this.redistributeTracks(this.isThreeColumnMode ? 3 : 2);
    }

    redistributeTracks(columnCount) {
        this.columns.forEach(column => {
            column.innerHTML = '';
        });

        if (columnCount === 3) {
            this.thirdColumn.style.display = 'block';
            this.container.classList.add('three-columns');
        } else {
            this.thirdColumn.style.display = 'none';
            this.container.classList.remove('three-columns');
        }

        if (this.trackElements.length === 0) {
            return;
        }

        const perColumn = Math.ceil(this.trackElements.length / columnCount);
        this.trackElements.forEach((track, index) => {
            const columnIndex = Math.min(Math.floor(index / perColumn), columnCount - 1);
            const targetColumn = this.columns[columnIndex];
            targetColumn.appendChild(track);
        });
    }

    applyLayout(viewportWidth) {
        const shouldUseThreeColumns = viewportWidth >= 1800;

        if (shouldUseThreeColumns !== this.isThreeColumnMode) {
            this.isThreeColumnMode = shouldUseThreeColumns;
            this.redistributeTracks(this.isThreeColumnMode ? 3 : 2);
        } else if (this.trackElements.length === 0) {
            this.redistributeTracks(this.isThreeColumnMode ? 3 : 2);
        }
    }

    handleResize() {
        this.applyLayout(window.innerWidth);
    }

    handleDocumentClick(event) {
        const trackComponent = event.target.closest('.track-component');
        if (trackComponent && this.container.contains(trackComponent)) {
            this.handleTrackClick(trackComponent);
        } else if (this.currentlySelectedTrack) {
            this.cancelEdit();
        }
    }

    handleTrackClick(trackComponent) {
        if (this.currentlySelectedTrack && this.currentlySelectedTrack !== trackComponent) {
            this.cancelEdit();
        }

        if (this.currentlySelectedTrack === trackComponent) {
            return;
        }

        this.selectTrack(trackComponent);
    }

    selectTrack(trackComponent) {
        this.trackElements.forEach(track => {
            track.classList.remove('selected');
        });

        trackComponent.classList.remove('edited');
        trackComponent.classList.add('selected');
        this.currentlySelectedTrack = trackComponent;

        const nameDiv = trackComponent.querySelector('.track-name');
        if (!nameDiv) {
            return;
        }

        const currentText = nameDiv.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'track-input';
        input.value = currentText === 'Old Track Name' ? '' : currentText;
        input.placeholder = 'Enter new track name';

        nameDiv.textContent = '';
        nameDiv.appendChild(input);

        input.focus();
        input.select();

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.confirmEdit(trackComponent, input.value.trim());
            } else if (event.key === 'Escape') {
                this.cancelEdit();
            }
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (this.currentlySelectedTrack === trackComponent) {
                    this.cancelEdit();
                }
            }, 100);
        });
    }

    confirmEdit(trackComponent, newText) {
        if (!trackComponent || !this.currentlySelectedTrack) {
            return;
        }

        trackComponent.classList.remove('selected');
        trackComponent.classList.add('edited');

        const nameDiv = trackComponent.querySelector('.track-name');
        if (nameDiv) {
            nameDiv.textContent = newText || 'Old Track Name';
        }

        this.currentlySelectedTrack = null;
    }

    cancelEdit() {
        if (!this.currentlySelectedTrack) {
            return;
        }

        this.currentlySelectedTrack.classList.remove('selected');
        const nameDiv = this.currentlySelectedTrack.querySelector('.track-name');
        if (nameDiv) {
            nameDiv.textContent = 'Old Track Name';
        }

        this.currentlySelectedTrack = null;
    }

    redirectToInitialScreen() {
        window.location.href = 'Initial Screen.html';
    }
}

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const screen = document.querySelector('[data-screen="track-view"]');
        const tracksContainer = screen ? screen.querySelector('[data-role="tracks"]') : null;

        if (!screen || !tracksContainer || !window.UIComponents) {
            return;
        }

        const { element: footer } = window.UIComponents.createTrackSelection([
            { label: 'Track Assignment', active: true },
            { label: 'Group Assignment' },
            { label: 'View Assignment' }
        ]);

        screen.appendChild(footer);

        const manager = new TrackManager(tracksContainer);
        manager.initialize();
    });
})();
