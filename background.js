
chrome.storage.onChanged.addListener(function(changes, areaName) {
    console.log(changes);
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    //we know the alarm name
    let theName = alarm.name;
    chrome.storage.local.get([theName], function(result) {
        console.log(result);
        var theURL = result[theName];
        console.log(theURL);
        chrome.tabs.create({url: theURL});
    });
    
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log("got message");

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
        console.log("created alarm " + newName);
    }
    else if(request.type == 'clear') {
        chrome.alarms.clearAll();
    }
});

