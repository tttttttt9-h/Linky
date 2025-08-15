(async () => {
    const url = window.location.href;
    const title = document.title;

    function saveLinkAndCopy() {
        // 클립보드에 URL 복사
        navigator.clipboard.writeText(url).then(() => {
            console.log('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL to clipboard:', err);
        });

        chrome.storage.local.get(['linkList'], function(result) {
            const linkList = result.linkList || [];
            
            const isDuplicate = linkList.some(item => item.url === url);
            if (isDuplicate) {
                showNotification('이미 저장된 링크입니다.');
            } else {
                if (linkList.length >= 10) {
                    linkList.pop();
                }
                linkList.unshift({ url: url, title: title });
                
                chrome.storage.local.set({ 'linkList': linkList }, function() {
                    showNotification('링크가 저장되었습니다!');
                });
            }
        });
    }

    function showNotification(message) {
        const existingNotification = document.getElementById('linky-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'linky-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1500);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        #linky-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
            color: #333333;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: fadeInOut 1.5s ease-in-out forwards;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -60%); }
            10% { opacity: 1; transform: translate(-50%, -50%); }
            90% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -40%); }
        }
    `;
    document.head.appendChild(style);

    saveLinkAndCopy();
})();