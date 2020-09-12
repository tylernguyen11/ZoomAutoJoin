
var alarms = new Map();

chrome.alarms.onAlarm.addListener(function (alarm) {
    //we know the alarm name
    let theURL = alarms.get(alarm.name);
    chrome.tabs.create({url: theURL});
    
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log("got message");

    if(request.type == 'submit') {
        var newURL = "https://zoom.com/j/" + request.roomID;
        var newName = request.name;
        alarms.set(newName, newURL);
        console.log("created alarm " + newName);
    }
    else if(request.type == 'clear') {
        console.log(alarms.size);
        alarms.clear();
        console.log(alarms.size);
        chrome.alarms.clearAll();
    }
});

