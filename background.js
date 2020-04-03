chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'switchValue': false}, function() {
      console.log("Switch is "+false);
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'music.youtube.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.sync.get('switchValue', function(data) {
        value = data.switchValue;
        if(value){
            const code = `(function getUrls(){
                const songName = document.querySelector('yt-formatted-string[class="title style-scope ytmusic-player-bar"]') 
                    ? document.querySelector('yt-formatted-string[class="title style-scope ytmusic-player-bar"]').title
                    : undefined;
                const songInfo = document.querySelector('yt-formatted-string[class="byline style-scope ytmusic-player-bar complex-string"]') 
                    ? document.querySelector('yt-formatted-string[class="byline style-scope ytmusic-player-bar complex-string"]').title
                    : undefined;
                return { songName, songInfo };
            })()`;

            const ytmusicURLs = ['www.music.youtube.com','music.youtube.com'];
            if(tab.status == 'complete' && ytmusicURLs.some(url => tab.url.includes(url))){
                setTimeout(() => {
                    chrome.tabs.executeScript(tabId, { code }, function(result) {
                        const { songName, songInfo } = result[0];
                        notHandle = true;
                        chrome.storage.sync.get('oldSongInfo', function(songData) {
                            if(songData.oldSongInfo.localeCompare(`${songName}\n${songInfo}`)===0){
                                notHandle = false;
                            }
                            else{
                                notHandle = true;
                            }
                            if(songName!=undefined && songInfo!=undefined && notHandle){
                                chrome.storage.sync.set({'oldSongInfo': `${songName}\n${songInfo}`});
                                function getNotificationId() {
                                    var id = Math.floor(Math.random() * 9007199254740992) + 1;
                                    return id.toString();
                                }
                                chrome.notifications.create(getNotificationId(), {
                                    title: 'Now Playing',
                                    iconUrl: 'icon128.png',
                                    type: 'basic',
                                    message: `${songName}\n${songInfo}`
                                }, function() {});
                            }
                        });
                    });
                }, 2000);
            }
        }
    });
});