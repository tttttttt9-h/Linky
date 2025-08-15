(async () => {
    const url = window.location.href;
    const title = document.title;

    function saveLink() {
        chrome.storage.local.get(['linkList'], function(result) {
            const linkList = result.linkList || [];
            
            // 중복 방지: 이미 저장된 링크인지 확인
            const isDuplicate = linkList.some(item => item.url === url);
            if (!isDuplicate) {
                // 최대 10개까지만 저장
                if (linkList.length >= 10) {
                    linkList.shift(); // 가장 오래된 링크(맨 앞) 삭제
                }
                linkList.push({ url: url, title: title });
            }

            chrome.storage.local.set({ 'linkList': linkList }, function() {
                // 저장 완료
            });
        });
    }

    saveLink();
})();