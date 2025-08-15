document.addEventListener('DOMContentLoaded', () => {
    const linkListElement = document.getElementById('link-list');
    const noLinksMessage = document.getElementById('no-links');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const openShortcutsBtn = document.getElementById('openShortcutsBtn');
    
    document.body.addEventListener('click', (event) => {
        const activeDeleteContainer = document.querySelector('.delete-confirm-buttons');
        const activeClearAllContainer = document.querySelector('.clear-all-confirm-buttons');

        if (activeDeleteContainer && !activeDeleteContainer.contains(event.target) && !event.target.closest('.delete-btn')) {
            const listItem = activeDeleteContainer.closest('.link-item');
            if (listItem) {
                activeDeleteContainer.remove();
                listItem.querySelector('.delete-btn').style.display = 'flex';
            }
        }
        
        if (activeClearAllContainer && !activeClearAllContainer.contains(event.target) && !event.target.closest('.clear-all-btn')) {
            activeClearAllContainer.remove();
            clearAllBtn.style.display = 'block';
            openShortcutsBtn.style.display = 'block';
        }
    });

    function renderLinkList(linkList) {
        linkListElement.innerHTML = '';
        if (linkList.length > 0) {
            noLinksMessage.style.display = 'none';
            clearAllBtn.style.display = 'block';
            linkList.forEach((linkData, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('link-item');

                const linkAnchor = document.createElement('a');
                linkAnchor.href = linkData.url;
                linkAnchor.textContent = linkData.title || linkData.url;
                linkAnchor.target = "_blank";
                linkAnchor.title = linkData.url;

                const copyButton = document.createElement('button');
                copyButton.classList.add('copy-btn');
                copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(linkData.url).then(() => {
                        copyButton.innerHTML = '<span class="material-icons check-icon">content_paste</span>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<span class="material-icons">content_copy</span>';
                        }, 1000);
                    });
                });

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.innerHTML = '<span class="material-icons">delete</span>';
                deleteButton.addEventListener('click', () => {
                    const existingContainer = listItem.querySelector('.delete-confirm-buttons');
                    if (existingContainer) {
                        existingContainer.remove();
                    }
                    
                    deleteButton.style.display = 'none';

                    const confirmButtonsContainer = document.createElement('div');
                    confirmButtonsContainer.classList.add('delete-confirm-buttons');
                    
                    const confirmYes = document.createElement('button');
                    confirmYes.classList.add('confirm-yes');
                    confirmYes.innerHTML = '<span class="material-icons">check</span>';
                    confirmYes.addEventListener('click', () => {
                        linkList.splice(index, 1);
                        chrome.storage.local.set({ 'linkList': linkList }, () => {
                            renderLinkList(linkList);
                        });
                    });

                    const confirmNo = document.createElement('button');
                    confirmNo.classList.add('confirm-no');
                    confirmNo.innerHTML = '<span class="material-icons">close</span>';
                    confirmNo.addEventListener('click', (event) => {
                        confirmButtonsContainer.remove();
                        deleteButton.style.display = 'flex';
                        event.stopPropagation();
                    });
                    
                    confirmButtonsContainer.appendChild(confirmYes);
                    confirmButtonsContainer.appendChild(confirmNo);
                    listItem.appendChild(confirmButtonsContainer);
                });

                listItem.appendChild(linkAnchor);
                listItem.appendChild(copyButton);
                listItem.appendChild(deleteButton);
                linkListElement.appendChild(listItem);
            });
        } else {
            noLinksMessage.style.display = 'block';
            clearAllBtn.style.display = 'none';
        }
    }
    
    clearAllBtn.addEventListener('click', (event) => {
        const headerButtons = document.querySelector('.header-buttons');
        const existingConfirmButtons = headerButtons.querySelector('.clear-all-confirm-buttons');
        
        if (existingConfirmButtons) {
            existingConfirmButtons.remove();
            clearAllBtn.style.display = 'block';
            openShortcutsBtn.style.display = 'block';
            return;
        }

        clearAllBtn.style.display = 'none';
        openShortcutsBtn.style.display = 'none';

        const confirmButtonsContainer = document.createElement('div');
        confirmButtonsContainer.classList.add('clear-all-confirm-buttons');
        
        const confirmYes = document.createElement('button');
        confirmYes.classList.add('confirm-yes');
        confirmYes.innerHTML = '<span class="material-icons">check</span>';
        confirmYes.addEventListener('click', () => {
            chrome.storage.local.set({ 'linkList': [] }, () => {
                renderLinkList([]);
                clearAllBtn.style.display = 'block';
                openShortcutsBtn.style.display = 'block';
                confirmButtonsContainer.remove();
            });
        });

        const confirmNo = document.createElement('button');
        confirmNo.classList.add('confirm-no');
        confirmNo.innerHTML = '<span class="material-icons">close</span>';
        confirmNo.addEventListener('click', () => {
            clearAllBtn.style.display = 'block';
            openShortcutsBtn.style.display = 'block';
            confirmButtonsContainer.remove();
        });
        
        confirmButtonsContainer.appendChild(confirmYes);
        confirmButtonsContainer.appendChild(confirmNo);
        headerButtons.appendChild(confirmButtonsContainer);
        event.stopPropagation();
    });

    openShortcutsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });

    chrome.storage.local.get(['linkList'], function(result) {
        renderLinkList(result.linkList || []);
    });
});