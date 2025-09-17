(function (global) {
    const icons = {
        upload: '<svg class="upload-card__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0C9.30378 0 9.5911 0.13809 9.78087 0.375305L13.7809 5.37531C14.1259 5.80657 14.056 6.43586 13.6247 6.78087C13.1934 7.12588 12.5641 7.05596 12.2191 6.62469L10 3.85078L10 11C10 11.5523 9.55228 12 9 12C8.44772 12 8 11.5523 8 11L8 3.85078L5.78087 6.62469C5.43586 7.05596 4.80657 7.12588 4.37531 6.78087C3.94404 6.43586 3.87412 5.80657 4.21913 5.37531L8.21913 0.375305C8.4089 0.13809 8.69622 0 9 0ZM0 12C0 10.8954 0.89543 10 2 10H4C4.55228 10 5 10.4477 5 11C5 11.5523 4.55228 12 4 12H2V16H16V12H14C13.4477 12 13 11.5523 13 11C13 10.4477 13.4477 10 14 10H16C17.1046 10 18 10.8954 18 12V16C18 17.1046 17.1046 18 16 18H2C0.895431 18 0 17.1046 0 16V12ZM13 14C13 13.4477 13.4477 13 14 13H14.01C14.5623 13 15.01 13.4477 15.01 14C15.01 14.5523 14.5623 15 14.01 15H14C13.4477 15 13 14.5523 13 14Z" fill="#6A7282"/>\n                </svg>',
        search: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.83341 1.33333C2.90042 1.33333 1.33341 2.90034 1.33341 4.83333C1.33341 6.76633 2.90042 8.33333 4.83341 8.33333C6.76641 8.33333 8.33341 6.76633 8.33341 4.83333C8.33341 2.90034 6.76641 1.33333 4.83341 1.33333ZM0.166748 4.83333C0.166748 2.25601 2.25609 0.166668 4.83341 0.166668C7.41074 0.166668 9.50008 2.25601 9.50008 4.83333C9.50008 7.41066 7.41074 9.5 4.83341 9.5C2.25609 9.5 0.166748 7.41066 0.166748 4.83333ZM8.79594 8.79586C9.02374 8.56805 9.39309 8.56805 9.62089 8.79586L11.6626 10.8375C11.8904 11.0653 11.8904 11.4347 11.6626 11.6625C11.4348 11.8903 11.0654 11.8903 10.8376 11.6625L8.79594 9.62081C8.56813 9.39301 8.56813 9.02366 8.79594 8.79586Z" fill="white"/>\n                </svg>'
    };

    function createUploadCard(options) {
        const { message, buttonLabel, buttonId } = options;
        const card = document.createElement('section');
        card.className = 'upload-card no-drag';
        card.innerHTML = `
            <div class="upload-card__dropzone">
                ${icons.upload}
                <div class="upload-card__message" data-role="upload-message">${message}</div>
            </div>
            <button type="button" class="button no-drag" data-role="browse-button">
                ${icons.search}
                <span>${buttonLabel}</span>
            </button>
        `;

        const button = card.querySelector('[data-role="browse-button"]');
        if (buttonId) {
            button.id = buttonId;
        }

        return {
            element: card,
            button,
            messageElement: card.querySelector('[data-role="upload-message"]')
        };
    }

    function createTrackSelection(tabs = []) {
        const container = document.createElement('div');
        container.className = 'track-selection no-drag';
        const tabElements = [];

        tabs.forEach((tab, index) => {
            const tabElement = document.createElement('div');
            tabElement.className = 'selection-tab';
            if (tab.active || (typeof tab.active === 'undefined' && index === 0)) {
                tabElement.classList.add('active');
            }
            tabElement.textContent = tab.label;
            container.appendChild(tabElement);
            tabElements.push(tabElement);
        });

        return {
            element: container,
            tabElements
        };
    }

    function createTrackColumn(options = {}) {
        const { isThird = false } = options;
        const column = document.createElement('div');
        column.className = 'track-column';
        if (isThird) {
            column.classList.add('track-column-third');
            column.style.display = 'none';
        }
        return column;
    }

    function createTrackComponent(options) {
        const { name, filePath = '', index } = options;
        const component = document.createElement('div');
        component.className = 'track-component';

        if (typeof index === 'number') {
            component.dataset.fileIndex = String(index);
        }

        if (filePath) {
            component.dataset.filePath = filePath;
        }

        const nameElement = document.createElement('div');
        nameElement.className = 'track-name';
        nameElement.textContent = name;
        component.appendChild(nameElement);

        return component;
    }

    global.UIComponents = {
        createUploadCard,
        createTrackSelection,
        createTrackColumn,
        createTrackComponent
    };
})(window);
