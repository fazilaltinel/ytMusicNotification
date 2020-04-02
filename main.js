let toggleButton = document.getElementById('toggleButton');

chrome.storage.sync.get('switchValue', function(data) {
    toggleButton.checked = data.switchValue;
});

toggleButton.onclick = function(element) {
    let value = this.checked;
    chrome.storage.sync.set({'switchValue': value}, function() {
        console.log("Switch is " + value);
    });
    if(value) {
        function getNotificationId() {
            var id = Math.floor(Math.random() * 9007199254740992) + 1;
            return id.toString();
        }
        chrome.notifications.create(getNotificationId(), {
            title: 'ytMusicNotification',
            iconUrl: 'icon128.png',
            type: 'basic',
            message: 'The extension is active.'
        }, function() {});
    }
    else{
        function getNotificationId() {
            var id = Math.floor(Math.random() * 9007199254740992) + 1;
            return id.toString();
        }
        chrome.notifications.create(getNotificationId(), {
            title: 'ytMusicNotification',
            iconUrl: 'icon128.png',
            type: 'basic',
            message: 'The extension is inactive.'
        }, function() {});
    }
};