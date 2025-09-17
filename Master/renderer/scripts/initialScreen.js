const { ipcRenderer } = require('electron');

(function () {
    const defaultMessage = 'Select a directory containing audio files...';
    const missingFilesMessage = 'No audio files found in selected directory';
    const errorMessage = 'Error selecting directory';
    const errorResetMessage = 'Drag or upload your stems...';

    document.addEventListener('DOMContentLoaded', () => {
        const screen = document.querySelector('[data-screen="initial"]');
        if (!screen || !window.UIComponents) {
            return;
        }

        const { element: footer } = window.UIComponents.createTrackSelection();
        screen.appendChild(footer);

        const uploadCard = window.UIComponents.createUploadCard({
            message: defaultMessage,
            buttonLabel: 'Browse folder',
            buttonId: 'browseFileBtn'
        });

        screen.appendChild(uploadCard.element);

        const browseButton = uploadCard.button;
        const messageElement = uploadCard.messageElement;

        browseButton.addEventListener('click', async () => {
            try {
                const result = await ipcRenderer.invoke('open-directory-dialog');

                if (!result.canceled && result.audioFiles) {
                    if (result.audioFiles.length > 0) {
                        localStorage.setItem('selectedAudioFiles', JSON.stringify(result.audioFiles));
                        if (result.directoryPath) {
                            localStorage.setItem('selectedDirectory', result.directoryPath);
                        }
                        window.location.href = 'Show All Files Screen.html';
                    } else {
                        showTemporaryMessage(missingFilesMessage, defaultMessage);
                    }
                }
            } catch (error) {
                console.error('Error opening directory dialog:', error);
                showTemporaryMessage(errorMessage, errorResetMessage);
            }
        });

        function showTemporaryMessage(message, resetMessage) {
            messageElement.textContent = message;
            setTimeout(() => {
                messageElement.textContent = resetMessage;
            }, 3000);
        }
    });
})();
