chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({LIST: []}, function() {
        console.log("Initialized the LIST array");
    });
    chrome.alarms.clearAll();
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    console.log("Changes to storage");
    console.log(changes);
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    let theName = alarm.name;
    console.log(theName);
    chrome.storage.local.get([theName], function(result) {
        var theURL = result[theName];
        chrome.tabs.create({url: theURL});
    });
    console.log("activated alarm " + theName);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type == 'submit') {
        var newURL = "\"https://zoom.com/j/" + request.roomID + "\"";
        var newName = "\"" + request.name + "\"";
        var stringy = "\{ " + newName + "\:" + newURL + " \}";
        var obj = JSON.parse(stringy);
        console.log(obj);
        chrome.storage.local.set(obj, function() {
            // Notify that we saved.
            console.log("Saved with key " + newName + " and value " + newURL);
        });
        chrome.alarms.getAll(function(alarms) {
            console.log("All alarms currently");
            console.log(alarms);
        });
    }
    else if(request.type == 'clear') {
        chrome.alarms.clearAll();
        chrome.storage.local.set({LIST: []});
        console.log("Alarms cleared");
    }
});

